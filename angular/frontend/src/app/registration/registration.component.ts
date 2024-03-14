import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Observable, of } from 'rxjs';

import { UserRegistrationModel, 
  UserRegistrationResponseModel } from '../models/user-registration.model';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private registrationService: RegistrationService) { }

  isFormPasswordsError = false;

  userRegistrationData: UserRegistrationModel = {
    username:'',
    password:'',
    re_password:'',
    profile: {
      surname:'',
      given_name:'',
      contact_email: ''
    }

  };

  registrationResponse$: Observable<
    UserRegistrationResponseModel|undefined> = of(undefined);

  passwordErrorMsg:string = 'The passwords must match!'

  ngOnInit(): void {

  }

  onSubmitRegistrationForm(form: NgForm) {
    console.log('submit resistration ...')
    console.log(form.value);
    if (form.invalid) {
      console.log('registration form is invalid')
      console.log(form.errors);
      return;
    }
    if (form.value.password !== form.value.re_password) {
      console.log('passwords do not match invalid')
      this.isFormPasswordsError = true;
      form.reset();
      return;
    }
    console.log('valid!')
    console.log(form.value.username);
    this.userRegistrationData.username = form.value.username;
    this.userRegistrationData.password = form.value.password;
    this.userRegistrationData.re_password = form.value.re_password;
    this.userRegistrationData.profile.contact_email = form.value.contact_email;
    this.userRegistrationData.profile.surname = form.value.surname;
    this.userRegistrationData.profile.given_name = form.value.given_name
    console.log(this.userRegistrationData);
    this.registrationResponse$ = this.registrationService
      .submitUserRegistration(this.userRegistrationData);
    form.reset();
  }


  onClearRegistrationFormError() {
    this.isFormPasswordsError = false;
  }

  onClearRegistrationMessage() {
    this.registrationResponse$ = of(undefined);
  }
}
