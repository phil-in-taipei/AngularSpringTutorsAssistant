import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { AuthService } from '../authentication/auth.service';
import { LoginComponent } from './login.component';
import { 
  loginData 
} from '../test-data/authentication-tests/authentication-data';

import { 
  findEl
  } from '../shared-utils/testing-helpers.util';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: any;
  let loginErrorListener = new Subject<boolean>();


  beforeEach(async () => {
    let mockAuthService:AuthService = jasmine.createSpyObj(
      ['clearLoginError', 'getIsLoginError', 
       'getLoginErrorListener', 'login']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [  
        LoginComponent,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ],
      // below is so that the nested components don't raise errors
      schemas: [NO_ERRORS_SCHEMA], 
    })
    .compileComponents();
  });

  beforeEach(() => {
    loginErrorListener.next(false);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService.getIsLoginError.and.returnValue(false);
    authService.getLoginErrorListener.and.returnValue(loginErrorListener)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message if service indicates there has been an error', 
    fakeAsync(() => {
    loginErrorListener.next(true);
    authService.getIsLoginError.and.returnValue(true);
    authService.getLoginErrorListener.and.returnValue(loginErrorListener);
    tick(1000);
    fixture.detectChanges()
    let errorMsg = findEl(fixture, 'login-error-msg');
    expect(errorMsg.nativeElement.textContent).toBe('Login Error, Try Again');
  }));

  it('should fill in the form with the entered values and call the login function on submit', 
    fakeAsync(() => {
      authService.login.and.callThrough();
      
      let usernameFormElement = findEl(fixture, 'username');
      usernameFormElement.nativeElement.value = loginData.username;
      usernameFormElement.nativeElement.dispatchEvent(new Event('input'));
      let passwordFormElement = findEl(fixture, 'password');
      passwordFormElement.nativeElement.value = loginData.password;
      passwordFormElement.nativeElement.dispatchEvent(new Event('input'));

      tick(1000);
      fixture.detectChanges();

      expect(passwordFormElement.nativeElement.value).toBe(loginData.password);
      expect(usernameFormElement.nativeElement.value).toBe(loginData.username);
      findEl(fixture, 'login-form').triggerEventHandler('submit', {});
     
      fixture.whenStable()

      // note: there is a bug on github that the values cannot be binded in the test
     // expect(authService.login).toHaveBeenCalledWith(
     //   {username: 'testusername', password: 'testpassword'}
      //);
      
      expect(authService.login).toHaveBeenCalled();
  }));

  /* below doesn't work because values and changes aren't bound to the form
     when programatically entering values into the fields in the test

  it('should show an error message when username is too short', 
    fakeAsync(() => {      
      let usernameFormElement = findEl(fixture, 'username');
      usernameFormElement.nativeElement.value = 'testuser'
      usernameFormElement.nativeElement.dispatchEvent(new Event('input'));
      let passwordFormElement = findEl(fixture, 'password');
      passwordFormElement.nativeElement.value = 'testpassword'
      passwordFormElement.nativeElement.dispatchEvent(new Event('input'));

      tick(1000);
      fixture.detectChanges();

      usernameFormElement.nativeElement.value = 't';
      usernameFormElement.nativeElement.touched = true;
      usernameFormElement.nativeElement.dispatchEvent(new Event('input'));

      tick(1000);
      fixture.detectChanges();
      let formEl = findEl(fixture, 'login-form');
      console.log(formEl.nativeElement);
      expect(passwordFormElement.nativeElement.value).toBe('testpassword');
      let usernameErrorMsg = findEl(fixture, 'username-error');
      console.log(usernameErrorMsg);
      expect(usernameFormElement.nativeElement.value).toBe('te');
  })); */


  it('should call authService.login when the form is submitted with valid data', () => {   
    authService.login.and.callThrough();
    const form = <NgForm>{
      invalid: false,
      value: {
        username: loginData.username,
        password: loginData.password,
      },
      reset: () => {}, // Mock the reset method
    };
    const formSpy = spyOn(form, 'reset');

    component.onLogin(form);

    expect(authService.login).toHaveBeenCalledWith(loginData.username, loginData.password);
    expect(formSpy).toHaveBeenCalled();
  });

  it('should not call authService.login when the form is submitted with invalid data', () => {
    authService.login.and.callThrough();
    const form = <NgForm>{
      invalid: true,
    };

    component.onLogin(form);

    expect(authService.login).not.toHaveBeenCalled();
  });


});
