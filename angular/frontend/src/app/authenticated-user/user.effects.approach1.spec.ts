import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { from, Observable, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { provideMockStore } from '@ngrx/store/testing';
import { initialUserProfileState, UserProfileState } from './user.reducers';
import { selectUserProfile } from './user.selectors';
import { 
    UserProfileSubmitted,
    UserProfileLoaded, 
    UserProfileRequested, 
    UserProfileSaved} from './user.actions';
import { UserProfileModel, UserProfileEditModel } from '../models/user-profile.model';

import { 
    userProfileData, userProfileEditData, userProfileEdited 
    } from '../test-data/authenticated-user-module-tests/user-related-tests/user-data';
import { UserEffects } from './user.effects';
import { UserService } from './user.service';

type PartialUserServiceFetch = Pick<UserService, 'fetchUserProfile'>;

type PartialUserServiceEdit = Pick<UserService, 'editUserProfile'>;

const fakeUserServiceFetch: PartialUserServiceFetch = {
    fetchUserProfile(): Observable<UserProfileModel> {
      return of(userProfileData);
    },
  };

const fakeUserServiceEdit: PartialUserServiceEdit = {
    editUserProfile(userProfileEditData: UserProfileEditModel): Observable<UserProfileModel> {
      return of(userProfileEdited);
    },
};

function expectActions(effect: Observable<Action>, actions: Action[]): void {
    let actualActions: Action[] | undefined;
    effect.pipe(toArray()).subscribe((actualActions2) => {
      actualActions = actualActions2;
    }, fail);
    expect(actualActions).toEqual(actions);
  }

function setupOne(actions: Action[], userService: PartialUserServiceFetch): UserEffects {
    spyOn(userService, 'fetchUserProfile').and.callThrough();
  
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
            initialState: {
                'user': initialUserProfileState
            },
            selectors: [
                {
                  selector: selectUserProfile,
                  value: undefined
                }
              ]
        }),
        provideMockActions(from(actions)),
        { provide: UserService, useValue: userService },
        UserEffects,
      ],
    });
  
    return TestBed.inject(UserEffects);
}

function setupTwo(actions: Action[], userService: PartialUserServiceEdit): UserEffects {
    spyOn(userService, 'editUserProfile').and.returnValue(of(userProfileEdited));
  
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
            initialState: {
                'user': initialUserProfileState
            },
            selectors: [
                {
                  selector: selectUserProfile,
                  value: userProfileData
                }
              ]
        }),
        provideMockActions(from(actions)),
        { provide: UserService, useValue: userService },
        UserEffects,
      ],
    });
  
    return TestBed.inject(UserEffects);
}

describe('UserEffects', () => {
    it('gets the user profile from backend on request to load if no user is in state', 
        () => {
        const userEffects = setupOne([new UserProfileRequested()], fakeUserServiceFetch);
        expectActions(userEffects.loadUserProfile$, 
            [new UserProfileLoaded({ usrProfile: userProfileData })]
        );

    });

    it('gets submits the edited user profile to backend and revised user data in state', 
        () => {
        const userEffects = setupTwo(
            [new UserProfileSubmitted({ submissionForm: userProfileEditData})], 
            fakeUserServiceEdit);
        expectActions(userEffects.submitEditedProfile$, 
            [new UserProfileSaved({ usrProfile: userProfileEdited })]
        );

    }); 
});