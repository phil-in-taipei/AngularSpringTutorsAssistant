import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
//import * as CryptoJS from 'crypto-js';
import {Store} from '@ngrx/store';
import { AppState } from './../reducers';
import { UserProfileCleared } from './../authenticated-user/user.actions';
import { environment } from '../../environments/environment';
import { AuthDataModel } from '../models/auth-data.model';
import { AuthLoginModel, AuthLoginResponseModel, 
  AuthTokenRefreshResponseModel } from '../models/auth-login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private isLoginError = false;
  private token: string;
  private tokenExpTime: Date
  private tokenTimer: NodeJS.Timer;
  private refresh: string;
  private refreshExpTime: Date;
  private authStatusListener = new Subject<boolean>();
  private loginErrorListener = new Subject<boolean>();
 // private encryptKey = 'lzzuciihtdffhbdwpjablrtvlotwbpxzgadaaqzerghvwaveui';

  constructor(private http: HttpClient, private router: Router, 
    private store: Store<AppState>) { }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      if (authInformation.accessExpDate && authInformation.token &&
          authInformation.refreshExp && authInformation.refresh) {
          console.log('Auth info in local storage:')
          console.log('this is when tokens will expire on reload:')
          console.log(authInformation.accessExpDate);
          console.log(authInformation.refreshExp);
          const now = new Date();
          if(authInformation.refreshExp > now) {
            console.log('refresh token is not expired. ' + 
              'Setting token variables and authentication status to true...')
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.token = authInformation.token;
            this.tokenExpTime = new Date(authInformation.accessExpDate);
            this.refresh = authInformation.refresh;
            this.refreshExpTime = new Date(authInformation.refreshExp);
            let timeUntilTokenExp = new Date().getTime() - this.tokenExpTime.getTime();
            console.log('reseting timer ....')
            this.setAuthTimer(timeUntilTokenExp); // if the value is negative, the timer will
                                                  // immediately trigger refreshTokenOrLogout();
            this.router.navigate(['/authenticated-user/user-profile']);
          } else {
            console.log('refresh token expired. Logging out...')
            this.logout();
            //return;
          }
      } else {
        console.log('Token info incomplete. Logging out...');
        this.logout();
        //return;
      }
    } else {
      console.log('Token info undefined. Logging out...');
        this.logout();
    }
  }

  clearLoginError() {
    this.loginErrorListener.next(false);
  }

  // public for testing purposes
  public fetchRefreshToken() {
    //let bytes  = CryptoJS.AES.decrypt(this.refresh, this.encryptKey);
    //let refresh = bytes.toString(CryptoJS.enc.Utf8);
    let refresh = this.refresh;
    console.log('this is the unencryped refresh token')
    console.log(refresh);
    this.http.post<AuthTokenRefreshResponseModel>(
      `${environment.apiUrl}/auth/jwt/refresh`, {refresh: refresh})
      .subscribe(response => {
        console.log(response)
        if (response.access) {
          this.token = response.access;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const dtToken:Date = new Date();
          console.log('now recieving login data ...')
          console.log('this is now:')
          console.log(dtToken);
          console.log('this is when the token will expire...');
          //dtToken.setMinutes(dtToken.getMinutes() + 4);
          dtToken.setSeconds(dtToken.getSeconds() + 50);
          console.log(dtToken);
          this.tokenExpTime = dtToken;
          this.setAuthTimer(50000); // 50000 (50 seconds) // 285000 (4.75 minutes)
          console.log('this is when the refresh will expire:')
          console.log(this.refreshExpTime);
          this.saveAuthData(this.refresh, this.refreshExpTime,
            this.token, this.tokenExpTime);
        }
      }, error => {
        console.log(error)
        this.authStatusListener.next(false);
        this.logout();
      });
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  private getAuthData():AuthDataModel | undefined {
    const token = localStorage.getItem('token');
    const accessExpDate = localStorage.getItem('expiration');
    const refresh = localStorage.getItem('refresh');
    const refreshExpDate = localStorage.getItem('refreshExpiration');
    if (!token || !accessExpDate || !refreshExpDate || !refresh) {
      return;
    }
    return {
      token: token,
      accessExpDate: new Date(accessExpDate),
      refresh: refresh,
      refreshExp: new Date(refreshExpDate)
    }
  }

  getAuthToken(): string {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getIsLoginError(): boolean {
    return this.isLoginError;
  }

  getLoginErrorListener() {
    return this.loginErrorListener.asObservable();
  }

  login(username: string, password: string) {
    const authData: AuthLoginModel = {username: username, password: password};
    this.http.post<AuthLoginResponseModel>(`${environment.apiUrl}/auth/jwt/create`, authData)
      .subscribe(response => {
        console.log('This is the login response:')
        console.log(response)
        if (response.access && response.refresh) {
          console.log('The tokens are both in the login response')
          this.refresh = response.refresh;
          //this.refresh = CryptoJS.AES.encrypt(response.refresh, this.encryptKey).toString();//response.refresh;
          this.token = response.access;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.loginErrorListener.next(false);
          const dtToken:Date = new Date();
          console.log('now recieving login data ...')
          console.log('this is now:')
          console.log(dtToken);
          console.log('this is when the token will expire...');
          dtToken.setMinutes(dtToken.getMinutes() + environment.tokenMinsAmount);
          dtToken.setSeconds(dtToken.getSeconds() + environment.tokenSecondsAmount);
          console.log(dtToken);
          this.tokenExpTime = dtToken;
          const dtRfrshTken:Date = new Date();
          // for testing, the refresh expires in 2 mins and 50 seconds
          // in production, the refresh expires in 23 hours and 45 minutes
          dtRfrshTken.setHours(dtRfrshTken.getHours() + environment.tokenRefreshHoursAmount);
          dtRfrshTken.setMinutes(dtRfrshTken.getMinutes() + environment.tokenRefreshMinsAmount);
          dtRfrshTken.setSeconds(dtRfrshTken.getSeconds() + environment.tokenRefreshSecondsAmount);
          this.refreshExpTime = new Date(dtRfrshTken);
          this.setAuthTimer(environment.authTimerAmount); // 285000 (4 minutes 45 seconds) // 50000 (50 seconds)
          console.log('this is when the refresh expires')
          console.log(dtRfrshTken);
          this.saveAuthData(this.refresh, this.refreshExpTime,
            this.token, this.tokenExpTime);
          this.router.navigate(['/authenticated-user/user-profile']);
        } else {
          console.log('the tokens are not in the response:')
          console.log(response);
        }
      }, error => {
        console.log(error)
        this.loginErrorListener.next(true);
        this.authStatusListener.next(false);
      })
    }

  logout() {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('refresh');
    localStorage.removeItem('refreshExpiration');
    localStorage.removeItem('userId');
    this.store.dispatch(new UserProfileCleared());
    this.router.navigate(['/']);
  }

  private refreshTokenOrLogout() {
    const now = new Date();
    if(this.refreshExpTime < now) {
      console.log('the refresh token is expired');
      this.logout();
      //this.router.navigate(['/']);
    } else {
      console.log('getting a new token...');
      this.fetchRefreshToken();
    }
  }

  private saveAuthData(refresh: string, refreshExpDate: Date,
    token: string, expirationDate: Date) {
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('refreshExpiration', refreshExpDate.toISOString());
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private setAuthTimer(duration: number) {
    console.log('this auth timer is being set');
    console.log(`for this long: ${duration}`);
    this.tokenTimer = setTimeout(() => {
        console.log('time is up!');
        let dt:Date = new Date();
        console.log(dt);
        this.refreshTokenOrLogout();
      }, duration);
  }

}
