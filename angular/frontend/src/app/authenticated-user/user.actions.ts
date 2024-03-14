import { Action } from '@ngrx/store';
import { UserProfileModel, 
    UserProfileEditModel } from '../models/user-profile.model';


export enum UserProfileActionTypes {
    UserProfileCleared = '[Auth Service Logout] User Profile Cleared',
    UserProfileLoaded = '[User Profile API] User Profile Loaded',
    UserProfileRequested = '[Authenticated User Component Page] User Profile Requested',
    UserProfileSaved = '[User Profile Edit Form] User Profile Saved',
    UserProfileSubmitted = '[User Profile Page] Edited Profile Submitted',
}

export class UserProfileCleared implements Action {
    readonly type = UserProfileActionTypes.UserProfileCleared;
}

export class UserProfileLoaded implements Action {
    readonly type = UserProfileActionTypes.UserProfileLoaded;
    constructor(public payload: { usrProfile: UserProfileModel }) { }
}

export class UserProfileRequested implements Action {
    readonly type = UserProfileActionTypes.UserProfileRequested;
}

export class UserProfileSaved implements Action {
    readonly type = UserProfileActionTypes.UserProfileSaved;
    constructor(public payload: { usrProfile: UserProfileModel }) {}
  }

export class UserProfileSubmitted implements Action {
    readonly type = UserProfileActionTypes.UserProfileSubmitted;
    constructor(public payload: { submissionForm: UserProfileEditModel }) {}
}

export type UserProfileActions = UserProfileCleared
| UserProfileLoaded| UserProfileRequested
| UserProfileSaved | UserProfileSubmitted 