import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, async, of, map, Subscription, Subject } from "rxjs";

import { AppState } from 'src/app/reducers';
import { selectUserProfile } from './../user.selectors';
import { UserProfileModel } from '../../models/user-profile.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  showForm:boolean = false;
  usrProfile$: Observable<UserProfileModel|undefined>;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    console.log('initializing the profile component now...')
    this.usrProfile$ = this.store.pipe(select(selectUserProfile));
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
}
