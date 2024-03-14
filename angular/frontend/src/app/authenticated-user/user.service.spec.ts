import { TestBed, fakeAsync, flush  } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule
} from '@angular/common/http/testing';

import { authData } from '../test-data/authentication-tests/authentication-data';
import { AuthService } from '../authentication/auth.service';
import { environment } from '../../environments/environment';
import { userProfileData, 
        userProfileEditData 
  } from '../test-data/authenticated-user-module-tests/user-related-tests/user-data';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthToken']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ UserService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should return a user profile from the api', 
    fakeAsync(() => {
    authServiceSpy.getAuthToken.and.returnValue(authData.token);
    service.fetchUserProfile().subscribe(response => {
      expect(response).toEqual(userProfileData);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url:`${environment.apiUrl}/api/profiles/user-profile/`,
    });

    request.flush(userProfileData);

    flush();

  }));

  it('should handle error due to network error when fetching user data', () => {
    authServiceSpy.getAuthToken.and.returnValue(authData.token);
    service.fetchUserProfile().subscribe(
      () => {},
      error => {
        expect(error).toBeTruthy();
      }
    );
  
    const request = httpTestingController.expectOne({
      method: 'GET',
      url:`${environment.apiUrl}/api/profiles/user-profile/`,
    });
    request.error(new ErrorEvent('network error'));
  
  });

  it('should return an updated user profile after submitting edited profile', 
    fakeAsync(() => {
    authServiceSpy.getAuthToken.and.returnValue(authData.token);
    userProfileData.contact_email = userProfileEditData.contact_email;
    userProfileData.surname = userProfileEditData.surname;
    userProfileData.given_name = userProfileEditData.given_name;

    service.editUserProfile(userProfileEditData).subscribe(response => {
      expect(response).toEqual(userProfileData);
    });

    const request = httpTestingController.expectOne({
      method: 'PATCH',
      url:`${environment.apiUrl}/api/profiles/user-profile/`,
    });

    request.flush(userProfileData);

    flush();

  }));

  it('should handle error due to network error when submitting edited user data', () => {
    authServiceSpy.getAuthToken.and.returnValue(authData.token);
    service.editUserProfile(userProfileEditData).subscribe(
      () => {},
      error => {
        expect(error).toBeTruthy();
      }
    );
  
    const request = httpTestingController.expectOne({
      method: 'PATCH',
      url:`${environment.apiUrl}/api/profiles/user-profile/`,
    });
    request.error(new ErrorEvent('network error'));
  
  });


  afterEach(() => {
    httpTestingController.verify();
  });
});
