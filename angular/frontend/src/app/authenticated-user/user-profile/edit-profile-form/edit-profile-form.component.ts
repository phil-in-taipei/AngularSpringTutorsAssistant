import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppState } from '../../../reducers';
import {select, Store} from '@ngrx/store';

import { UserProfileModel, UserProfileEditModel } from 'src/app/models/user-profile.model';
import { UserProfileSubmitted } from '../../user.actions';


@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.css']
})
export class EditProfileFormComponent implements OnInit {

  @Input() profile: UserProfileModel;
  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  onSubmitEditedProfile(form: NgForm) {

    if (form.invalid) {
      //console.log('the form is invalid!')
      form.reset();
      this.closeEvent.emit(false);
      return;
    }
    let submissionForm: UserProfileEditModel = {
      contact_email: form.value.contact_email,
      given_name: form.value.given_name,
      surname: form.value.surname,
    }
    this.store.dispatch(new UserProfileSubmitted(
      { submissionForm: submissionForm }
    ));
    form.resetForm();
    this.closeEvent.emit(false);
  }

}
