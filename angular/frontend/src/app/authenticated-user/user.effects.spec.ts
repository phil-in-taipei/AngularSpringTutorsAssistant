import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { from, Observable, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { provideMockStore } from '@ngrx/store/testing';


import { UserEffects } from './user.effects';
import { initialUserProfileState } from './user.reducers';
import { 
  userProfileData, userProfileEdited, userProfileEditData 
} from '../test-data/authenticated-user-module-tests/user-related-tests/user-data';
import { 
    UserProfileSubmitted,
    UserProfileLoaded, 
    UserProfileRequested, 
    UserProfileSaved
  } from './user.actions';
import { selectUserProfile } from './user.selectors';
import { UserService } from './user.service';
import { UserProfileModel, 
  UserProfileEditModel } from '../models/user-profile.model';


describe('UserEffects', () => {
    let effects: UserEffects;
    let userService: UserService;
  
    beforeEach(() => {
      const mockUserService = {
        fetchUserProfile(): Observable<UserProfileModel> {
          return of(userProfileData);
        },
        editUserProfile(userProfileEditData: UserProfileEditModel): 
          Observable<UserProfileModel> {
            return of(userProfileEdited);
        }
      };

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
            provideMockActions(from([new UserProfileRequested(), 
              new UserProfileSubmitted({ submissionForm: userProfileEditData})])),
            UserEffects,
            { provide: UserService, useValue: mockUserService }

          ]
      });

      effects = TestBed.inject(UserEffects);
      userService = TestBed.inject(UserService);
    });
            
    it('should call fetch the user profile if there is no user in state', 
        fakeAsync(() => {
        spyOn(userService, 'fetchUserProfile').and.returnValue(of(userProfileData));
        let actualActions: Action[] | undefined;
        const expectedActions: Action[] = [new UserProfileLoaded({ usrProfile: userProfileData })];
        
        effects.loadUserProfile$.pipe(toArray()).subscribe((actualActions2) => {
            actualActions = actualActions2;
          }, fail);
        
        expect(actualActions).toEqual(expectedActions);
        flush();
    }));

    it('should submit the edited user data to backend and update user data in state', 
      fakeAsync(() => {
      spyOn(userService, 'editUserProfile').and.returnValue(of(userProfileEdited));
      let actualActions: Action[] | undefined;
      const expectedActions: Action[] = [new UserProfileSaved({ usrProfile: userProfileEdited })];
      
      effects.submitEditedProfile$.pipe(toArray()).subscribe((actualActions2) => {
          actualActions = actualActions2;
        }, fail);
      
      expect(actualActions).toEqual(expectedActions);
      flush();
    }));

  });