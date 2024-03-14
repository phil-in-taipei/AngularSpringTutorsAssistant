import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserProfileState } from './user.reducers';


export const selectUserProfileState = createFeatureSelector<UserProfileState>("user")

export const selectUserProfile = createSelector(
  selectUserProfileState,
  UserProfileState => UserProfileState.usrProfile
);
