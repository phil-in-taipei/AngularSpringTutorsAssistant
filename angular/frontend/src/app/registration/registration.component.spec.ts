import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { 
  findEl
  } from '../shared-utils/testing-helpers.util';
import { RegistrationComponent } from './registration.component';
import { RegistrationService } from './registration.service';
import { userRegistrationData, 
  httpRegistrationResponseSuccess, 
  httpRegistrationResponseFailure1,
  httpRegistrationResponseFailure2 } 
  from '../test-data/registration-tests/registration-data';
import { UserRegistrationResponseModel } from '../models/user-registration.model';

fdescribe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let registrationResponse$: Observable<
    UserRegistrationResponseModel|undefined>;
  let registrationService: any;

  beforeEach(async () => {
    let mockregistrationervice:RegistrationService = jasmine.createSpyObj(
      ['submitUserRegistration']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ 
        RegistrationComponent 
      ],
      providers: [
        { provide: RegistrationService, useValue: mockregistrationervice }
      ],
      // below is so that the nested components don't raise errors
      schemas: [NO_ERRORS_SCHEMA], 
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    registrationResponse$ = of(undefined);
    registrationService = TestBed.inject(RegistrationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmitRegistrationForm function should submit the registration service form ' + 
    'to the registration service and clear the form', 
      fakeAsync(() => {
        registrationService.submitUserRegistration.and.returnValue(of(httpRegistrationResponseFailure2));
        const form = <NgForm>{
          invalid: false,
          value: {
            username: userRegistrationData.username,
            password: userRegistrationData.password,
            re_password: userRegistrationData.re_password,
            contact_email: userRegistrationData.profile.contact_email,
            surname: userRegistrationData.profile.surname,
            given_name: userRegistrationData.profile.given_name,
          },
          reset: () => {}, // Mock the reset method
        };
        const formSpy = spyOn(form, 'reset');
        component.onSubmitRegistrationForm(form);

        tick(1000);
        fixture.detectChanges();

        expect(registrationService.submitUserRegistration)
          .toHaveBeenCalledWith(
            userRegistrationData
          );
        expect(formSpy).toHaveBeenCalled();
  }));

  it('should display error message if registration service indicates there has been an error ' +
    'due to username already existing)', 
    fakeAsync(() => {
      registrationService.submitUserRegistration.and.returnValue(of(httpRegistrationResponseFailure2));
      const form = <NgForm>{
        invalid: false,
        value: {
          username: userRegistrationData.username,
          password: userRegistrationData.password,
          re_password: userRegistrationData.re_password,
          contact_email: userRegistrationData.profile.contact_email,
          surname: userRegistrationData.profile.surname,
          given_name: userRegistrationData.profile.given_name,
        },
        reset: () => {}, // Mock the reset method
      };
      const formSpy = spyOn(form, 'reset');
      component.onSubmitRegistrationForm(form);

      tick(1000);
      fixture.detectChanges();
      let errorMsg = findEl(fixture, 'registration-error-msg');
      expect(errorMsg.nativeElement.textContent).toBe('Registration Error!');
  }));

  it('should display error message if registration service indicates there has been an error ' +
    'due to submission of incomplete registration data)', 
    fakeAsync(() => {
      registrationService.submitUserRegistration.and.returnValue(of(httpRegistrationResponseFailure1));
      const form = <NgForm>{
        invalid: false,
        value: {
          username: userRegistrationData.username,
          password: userRegistrationData.password,
          re_password: userRegistrationData.re_password,
          contact_email: userRegistrationData.profile.contact_email,
          surname: userRegistrationData.profile.surname,
          given_name: userRegistrationData.profile.given_name,
        },
        reset: () => {}, // Mock the reset method
      };
      const formSpy = spyOn(form, 'reset');
      component.onSubmitRegistrationForm(form);

      tick(1000);
      fixture.detectChanges();
      let errorMsg = findEl(fixture, 'registration-error-msg');
      expect(errorMsg.nativeElement.textContent).toBe('Registration Error!');
  })); // httpRegistrationResponseSuccess

  it('should display success message if registration service indicates  ' +
    'form submission for creating new user was successful', 
    fakeAsync(() => {
      registrationService.submitUserRegistration.and.returnValue(of(httpRegistrationResponseSuccess));
      const form = <NgForm>{
        invalid: false,
        value: {
          username: userRegistrationData.username,
          password: userRegistrationData.password,
          re_password: userRegistrationData.re_password,
          contact_email: userRegistrationData.profile.contact_email,
          surname: userRegistrationData.profile.surname,
          given_name: userRegistrationData.profile.given_name,
        },
        reset: () => {}, // Mock the reset method
      };
      const formSpy = spyOn(form, 'reset');
      component.onSubmitRegistrationForm(form);

      tick(1000);
      fixture.detectChanges();
      let sucessMsg = findEl(fixture, 'registration-success-msg');
      expect(sucessMsg.nativeElement.textContent).toBe('User successfully created!');
  }));
});
