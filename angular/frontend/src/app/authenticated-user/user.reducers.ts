import { UserProfileActions, UserProfileActionTypes } from './user.actions';
import { UserProfileModel } from '../models/user-profile.model';

export interface UserProfileState {
    userProfileLoaded:boolean,
    usrProfile: UserProfileModel|undefined,
};

export const initialUserProfileState: UserProfileState = {
    userProfileLoaded: false,
    usrProfile: undefined,
};

export function userProfileReducer(
    state = initialUserProfileState,
    action: UserProfileActions): UserProfileState {
    switch(action.type) {

        case UserProfileActionTypes.UserProfileCleared:
            return initialUserProfileState;

        case UserProfileActionTypes.UserProfileLoaded:
            return {
                  userProfileLoaded: true,
                  usrProfile: action.payload.usrProfile,
            };

        case UserProfileActionTypes.UserProfileSaved:
            return {
                userProfileLoaded: true,
                usrProfile: action.payload.usrProfile,
            };            

        default: {
            return state;
          }
    }
}