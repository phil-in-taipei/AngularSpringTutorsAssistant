import { Action } from '@ngrx/store';
import { UserProfileModel, 
    UserProfileEditModel } from '../../../models/user-profile.model';


export enum UserProfileActionTypes {
    UserProfileCleared = '[Auth Service Logout] User Profile Cleared',
    UserProfileLoaded = '[User Profile API] User Profile Loaded',
    UserProfileMessagesCleared = '[User Profile Page] User Profile Messages Cleared',
    UserProfileRequested = '[Authenticated User Component Page] User Profile Requested',
    UserProfileRequestCancelled = '[Authenticated User Component Page] User Profile Request Cancelled',
    UserProfileSaved = '[User Profile Edit Form] User Profile Saved',
    UserProfileSubmissionCancelled = '[User Profile Page] Edited Profile Request Cancelled',
    UserProfileSubmitted = '[User Profile Page] Edited Profile Submitted',
}

export class UserProfileCleared implements Action {
    readonly type = UserProfileActionTypes.UserProfileCleared;
}

export class UserProfileLoaded implements Action {
    readonly type = UserProfileActionTypes.UserProfileLoaded;
    constructor(public payload: { usrProfile: UserProfileModel }) { }
}

export class UserProfileMessagesCleared implements Action {
    readonly type = UserProfileActionTypes.UserProfileMessagesCleared;
}


export class UserProfileRequested implements Action {
    readonly type = UserProfileActionTypes.UserProfileRequested;
}

export class UserProfileRequestCancelled implements Action {
    readonly type = UserProfileActionTypes.UserProfileRequestCancelled;
  
    constructor(public payload: {  err: any }) {}
}

export class UserProfileSaved implements Action {
    readonly type = UserProfileActionTypes.UserProfileSaved;
    constructor(public payload: { usrProfile: UserProfileModel }) {}
}

export class UserProfileSubmissionCancelled implements Action {
    readonly type = UserProfileActionTypes.UserProfileSubmissionCancelled;
  
    constructor(public payload: {  err: any }) {}
}


export class UserProfileSubmitted implements Action {
    readonly type = UserProfileActionTypes.UserProfileSubmitted;
    constructor(public payload: { submissionForm: UserProfileEditModel }) {}
}

export type UserProfileActions = UserProfileCleared
| UserProfileLoaded| UserProfileMessagesCleared 
| UserProfileRequested | UserProfileRequestCancelled
| UserProfileSaved | UserProfileSubmissionCancelled 
| UserProfileSubmitted;