import { UserProfileActions, UserProfileActionTypes } from './user.actions';
import { UserProfileModel } from '../../../models/user-profile.model';

export interface UserProfileState {
    errorMessage: string | undefined,
    successMessage: string | undefined,
    userProfileLoaded:boolean,
    usrProfile: UserProfileModel|undefined,
};

export const initialUserProfileState: UserProfileState = {
    errorMessage: undefined,
    successMessage: undefined,
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
                errorMessage: undefined,
                successMessage: undefined,
                userProfileLoaded: true,
                usrProfile: action.payload.usrProfile,
            };
        case UserProfileActionTypes.UserProfileMessagesCleared:
            return { 
                ...state,  successMessage: undefined,
                 errorMessage: undefined 
            };

        case UserProfileActionTypes.UserProfileSaved:
            return {
                errorMessage: undefined,
                successMessage: "User Profile has been Sucessfully Updated!",
                userProfileLoaded: true,
                usrProfile: action.payload.usrProfile,
            }; 

        case UserProfileActionTypes.UserProfileSubmissionCancelled:
            console.log('error adding savings account!');
            console.log(action.payload);
            let errorMessage: string = "Error! Update Submission Failed!";
            if (action.payload.err.error.message) {
                //console.log(action.payload.err.error.message)
                errorMessage = action.payload.err.error.message;
            }
            return {
                ...state,  successMessage: undefined,
                errorMessage: errorMessage
            }
               

        default: {
            return state;
          }
    }
}