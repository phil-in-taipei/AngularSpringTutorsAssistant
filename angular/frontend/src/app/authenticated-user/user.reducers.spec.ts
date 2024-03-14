import { stateWithLoadedUser, 
         stateWithRevisedUser 
} from '../test-data/authenticated-user-module-tests/user-related-tests/user-state';
import { userProfileReducer, initialUserProfileState } from './user.reducers';
import { userProfileData, 
        userProfileEdited 
} from '../test-data/authenticated-user-module-tests/user-related-tests/user-data';

import { UserProfileCleared, UserProfileLoaded, 
    UserProfileSaved } from './user.actions';


describe('userProfileReducer', () => {
    it('returns an initial state when cleared', () => {
        const state = userProfileReducer(initialUserProfileState, new UserProfileCleared());
        expect(state).toEqual(initialUserProfileState);
    });

    it('returns the state with a user profile and indicates that the profile has been loaded', () => {
        const state = userProfileReducer(initialUserProfileState, 
            new UserProfileLoaded({ usrProfile: userProfileData}));
        expect(state).toEqual(stateWithLoadedUser);
    });
    
    it('returns the state with a user profile and indicates that the profile has been loaded after editing', () => {
        const state = userProfileReducer(stateWithLoadedUser, 
            new UserProfileSaved({ usrProfile: userProfileEdited}));
        expect(state).toEqual(stateWithRevisedUser);
    });   
});