import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpTestingController, HttpClientTestingModule
   } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { httpTokensResponse, httpTokenResponseFailure,
  httpTokenRefreshResponse1, httpTokenRefreshResponse2, 
  httpTokenRefreshResponse3 } from '../test-data/authentication-tests/authentication-data';
import { UserProfileComponent } from '../authenticated-user/user-profile/user-profile.component';


describe('AuthService', () => {
  let testRouter: Router; 
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {


    let store: {[index: string]:any} = {};
    
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem')
     .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
     .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
     .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
     .and.callFake(mockLocalStorage.clear);
     

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([
        { path: 'authenticated-user/user-profile', component: UserProfileComponent }
        ]), ],
      providers: [
        AuthService, { provider: localStorage, useValue: mockLocalStorage },
      ]
    });

    testRouter = TestBed.inject(Router);
    spyOn(testRouter, 'navigate').and.returnValue(Promise.resolve(true));  

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getAuthStatusListener()).toBeTruthy();
    expect(service.getAuthToken()).toBeFalsy()
  });


  it('should accept user login data to make the request', 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    expect(request.request.body).toEqual({username: 'testusername', password: 'testpassword'});

    request.flush(httpTokensResponse);

    flush();

  }));

  it('should enable login error listener observable to return true after upon' + 
    ' unsuccessful login attempt with incorrect data', 
    fakeAsync(() => {
    let isLoginError = false;
    const authErrorListenerSubs$: Subscription = service.getLoginErrorListener()
      .subscribe(isError => {
        isLoginError = isError;
        });
    service.login('incorrectusername', 'incorrectpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });
    request.flush(httpTokenResponseFailure, { status: 400, statusText: 'Unauthorized' });
    expect(isLoginError).toBe(true);
    flush();
  }));

  it('should save the token, refresh token, and expiration times in local storage after login', 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    request.flush(httpTokensResponse);

    expect(localStorage.setItem).toHaveBeenCalledTimes(4); 

    expect(localStorage.getItem('refresh')).toEqual(httpTokensResponse['refresh']);
    expect(localStorage.getItem('token')).toEqual(httpTokensResponse['access']); 

    // saved to Date.prototype.toISOString should be 24 or 27 chars in length
    expect(localStorage.getItem('refreshExpiration')?.length).toBeGreaterThanOrEqual(24);
    expect(localStorage.getItem('expiration')?.length).toBeGreaterThanOrEqual(24);

    expect(service.getAuthToken()).toEqual(httpTokensResponse['access']);

    flush();

  }));

  it('should make the access token accesible by calling the getIsAuth() function after sucessful login', 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    request.flush(httpTokensResponse);

    expect(service.getAuthToken()).toEqual(httpTokensResponse['access']);

    flush();

  }));

  it('should set auth status to true upon successful login', 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    request.flush(httpTokensResponse);

    expect(service.getIsAuth()).toBe(true);

    flush();
  }));

  it('should enable auth status listener observable to return true upon successful login', 
    fakeAsync(() => {
    let userIsAuthenticated = false;
    const authListenerSubs$: Subscription = service.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        userIsAuthenticated = isAuthenticated;
        });
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    request.flush(httpTokensResponse);

    expect(userIsAuthenticated).toBe(true);

    flush();
  }));

  it('should be navigate to user landing page upon successful login', fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    request.flush(httpTokensResponse);
    expect(testRouter.navigate).toHaveBeenCalledWith(['/authenticated-user/user-profile']);

    flush();
  }));

  it(`should reset the timer and fetch a replacement token after ${environment.authTimerAmount} secs`, 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const loginRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    loginRequest.flush(httpTokensResponse);

    tick(environment.authTimerAmount);

    const refreshTokenRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest.flush(httpTokenRefreshResponse1);

    // the 4 variables (token, tokenExpTime, refresh, refreshExpTime)
    // will be saved twice -- once on login, and a second time after timer expires
    // and mock api call is made to fetch another token
    expect(localStorage.setItem).toHaveBeenCalledTimes(8); 

    expect(localStorage.getItem('refresh')).toEqual(httpTokensResponse['refresh']);
    expect(localStorage.getItem('token')).toEqual(httpTokenRefreshResponse1['access']); 
    
    tick(environment.authTimerAmount + 5);
  }));

  it(`should reset the timer and fetch a 2nd replacement token after ${environment.authTimerAmount * 2} secs`, 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const loginRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    loginRequest.flush(httpTokensResponse);

    tick(environment.authTimerAmount);

    const refreshTokenRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest.flush(httpTokenRefreshResponse1);

    tick(environment.authTimerAmount * 2 + 5);

    const refreshTokenRequest2 = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest2.flush(httpTokenRefreshResponse2);

    // the 4 variables (token, tokenExpTime, refresh, refreshExpTime)
    // will be saved three times -- once on login, and a 2 mores times after timer expires
    // and mock api calls are made to fetch refresh tokens
    expect(localStorage.setItem).toHaveBeenCalledTimes(12); 

    expect(localStorage.getItem('refresh')).toEqual(httpTokensResponse['refresh']);
    expect(localStorage.getItem('token')).toEqual(httpTokenRefreshResponse2['access']); 
    
    tick(environment.authTimerAmount * 2 + 10);
  }));

  it(`should reset the timer and fetch a 3rd replacement token after ${environment.authTimerAmount * 3} secs`, 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const loginRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    loginRequest.flush(httpTokensResponse);

    tick(environment.authTimerAmount);

    const refreshTokenRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest.flush(httpTokenRefreshResponse1);

    tick(environment.authTimerAmount * 2 + 1);

    const refreshTokenRequest2 = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest2.flush(httpTokenRefreshResponse2);

    tick(environment.authTimerAmount * 3 + 2);

    const refreshTokenRequest3 = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest3.flush(httpTokenRefreshResponse3);

    // the 4 variables (token, tokenExpTime, refresh, refreshExpTime)
    // will be saved four times -- once on login, and a 2 mores times after timer expires
    // and mock api calls are made to fetch refresh tokens
    expect(localStorage.setItem).toHaveBeenCalledTimes(16); 

    expect(localStorage.getItem('refresh')).toEqual(httpTokensResponse['refresh']);
    expect(localStorage.getItem('token')).toEqual(httpTokenRefreshResponse3['access']); 
    
    tick(environment.authTimerAmount * 3 + 10);
  }));

  it(`should repeatedly reset the timer,fetching token 3 times, and log user out due to refresh token expiration`, 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const loginRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    loginRequest.flush(httpTokensResponse);

    tick(environment.authTimerAmount);

    const refreshTokenRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest.flush(httpTokenRefreshResponse1);

    tick(environment.authTimerAmount * 2 + 1);

    const refreshTokenRequest2 = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest2.flush(httpTokenRefreshResponse2);

    tick(environment.authTimerAmount * 3 + 2);

    const refreshTokenRequest3 = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest3.flush(httpTokenRefreshResponse3);
      
    tick(environment.authTimerAmount * 3 + 10);


        // the 4 variables (token, tokenExpTime, refresh, refreshExpTime)
    // will be saved four times -- once on login, and a 2 mores times after timer expires
    // and mock api calls are made to fetch refresh tokens
    expect(localStorage.setItem).toHaveBeenCalledTimes(16); 


    // the items are no longer in local storage
    expect(localStorage.getItem('refresh')).toEqual(null);
    expect(localStorage.getItem('token')).toEqual(null); 
    expect(localStorage.getItem('refreshExpiration')).toEqual(null); 
    expect(localStorage.getItem('expiration')).toEqual(null); 

    // user has been logged out
    expect(service.getIsAuth()).toBe(false);
  
    flush();
  }));

  it(`should redirect the router to the login page after logging out`, 
      fakeAsync(() => {
    service.logout();
    expect(testRouter.navigate).toHaveBeenCalledWith(['/']);
    flush();
  }));

  it(`should set authentication status to false after logging out`, 
      fakeAsync(() => {
    service.logout();
    // user has been logged out
    expect(service.getIsAuth()).toBe(false);
    flush();
  }));

  it(`should clear all items from local storage after logging out`, 
      fakeAsync(() => {
    // mock setting tokens and expiration times in local storage

    // for testing the token expires in 50 seconds, in production 4 mins 50 secs
    const dtToken:Date = new Date();
    dtToken.setSeconds(dtToken.getSeconds() + environment.tokenSecondsAmount);
    const dtRfrshTken:Date = new Date();

    // for testing, the refresh expires in 2 mins and 50 seconds
    // in production, the refresh expires in 23 hours and 45 minutes
    dtRfrshTken.setMinutes(dtRfrshTken.getMinutes() + environment.tokenRefreshMinsAmount);
    dtRfrshTken.setSeconds(dtRfrshTken.getSeconds() + environment.tokenRefreshSecondsAmount);
    localStorage.setItem('refresh', httpTokensResponse.refresh);
    localStorage.setItem('refreshExpiration', dtRfrshTken.toISOString());
    localStorage.setItem('token', httpTokensResponse.access);
    localStorage.setItem('expiration', dtToken.toISOString());

    service.logout();

    // after logout, the items are no longer in local storage
    expect(localStorage.getItem('refresh')).toEqual(null);
    expect(localStorage.getItem('token')).toEqual(null); 
    expect(localStorage.getItem('refreshExpiration')).toEqual(null); 
    expect(localStorage.getItem('expiration')).toEqual(null); 
    flush();
  }));

  it('should enable auth status listener observable to return false after logout is called', 
    fakeAsync(() => {
    let userIsAuthenticated = true;
    const authListenerSubs$: Subscription = service.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        userIsAuthenticated = isAuthenticated;
        });

    service.logout();
    expect(userIsAuthenticated).toBe(false);

    flush();
  }));
});
