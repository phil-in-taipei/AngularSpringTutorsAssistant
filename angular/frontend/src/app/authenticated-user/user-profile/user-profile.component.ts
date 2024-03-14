import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable,  of } from "rxjs";

import { AppState } from 'src/app/reducers';
import { 
  selectUserProfile, selectUserProfileLoaded,
  userProfileSubmissionErrorMsg, userProfileSubmissionSuccessMsg
} from './../user.selectors';
import { UserProfileModel } from '../../models/user-profile.model';
import { UserProfileMessagesCleared } from '../user.actions';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  showForm:boolean = false;
  usrProfile$: Observable<UserProfileModel|undefined> = of(undefined);
  usrProfileLoaded$: Observable<boolean> = of(false);
  userProfileSubmitErrMsg$: Observable<string | undefined> = of(undefined);
  userProfileSubmitSuccessMsg$: Observable<string | undefined> = of(undefined);

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    console.log('initializing the profile component now...')
    this.store.dispatch(new UserProfileMessagesCleared());
    this.usrProfile$ = this.store.pipe(select(selectUserProfile));
    this.usrProfileLoaded$ = this.store.pipe(select(selectUserProfileLoaded));
    this.userProfileSubmitErrMsg$ = this.store.pipe(
      select(userProfileSubmissionErrorMsg)
    );
    this.userProfileSubmitSuccessMsg$ = this.store.pipe(
      select(userProfileSubmissionSuccessMsg)
    );
  }

  toggleForm() {
    if (this.showForm) {
      this.showForm = false;
    } else {
      this.showForm = true;
    }
  }

  closeFormHander($event: boolean) {
    this.showForm = $event;
  }

  onClearStatusMsgs() {
    this.store.dispatch(new UserProfileMessagesCleared());
  }
}
