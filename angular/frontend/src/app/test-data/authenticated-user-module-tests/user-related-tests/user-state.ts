import { UserProfileState } from "src/app/authenticated-user/user.reducers";
import { userProfileData, userProfileEdited} from "./user-data";

export const stateWithLoadedUser: UserProfileState = {
    userProfileLoaded: true,
    usrProfile: userProfileData
};

export const stateWithRevisedUser: UserProfileState = {
    userProfileLoaded: true,
    usrProfile: userProfileEdited
}
