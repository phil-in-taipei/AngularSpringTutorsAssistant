import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError, filter, map, 
  mergeMap, withLatestFrom}  from "rxjs/operators";

import { AppState } from '../reducers';
import { selectUserProfile } from './user.selectors';
import { UserService } from './user.service';
import { UserProfileActionTypes, UserProfileSubmitted,
    UserProfileLoaded, UserProfileRequested, UserProfileSaved,
     } from './user.actions';


@Injectable()
    export class UserEffects {
    
      loadUserProfile$ = createEffect(() => {
        return this.actions$
          .pipe(
            ofType<UserProfileRequested>(UserProfileActionTypes.UserProfileRequested),
            withLatestFrom(this.store.pipe(select(selectUserProfile))),
            filter(([action, userProfileLoaded]) => !userProfileLoaded),
            mergeMap(action => this.userService.fetchUserProfile()
              .pipe(
                map(usrProfile => new UserProfileLoaded({ usrProfile })),
                catchError(err => {
                  return throwError(() => err);
                })
              ))
          )
      });

      submitEditedProfile$ = createEffect(() => {
        return this.actions$
          .pipe(
            ofType<UserProfileSubmitted>(UserProfileActionTypes.UserProfileSubmitted),
            mergeMap(action => this.userService.editUserProfile(action.payload.submissionForm)
                .pipe(
                    map(usrProfile => new UserProfileSaved({ usrProfile })),
                    catchError(err => {
                      return throwError(() => err);
                    })
                ),
              )
          )
      });

      constructor(private actions$: Actions, private userService: UserService,
          private store: Store<AppState>) {}
}
