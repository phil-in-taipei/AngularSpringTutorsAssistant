import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isErrorLogin:boolean = false;
  private errorLogin$: Subscription;
  errorMsg:string = 'There was an error logging in'

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.isErrorLogin = this.authService.getIsLoginError();
    this.errorLogin$ = this.authService
      .getLoginErrorListener()
      .subscribe(isErrorLogin => {
        this.isErrorLogin = isErrorLogin;
    });
  }

  onClearLoginError() {
    this.authService.clearLoginError();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.login(form.value.username, form.value.password);
    form.reset();
  }

}
