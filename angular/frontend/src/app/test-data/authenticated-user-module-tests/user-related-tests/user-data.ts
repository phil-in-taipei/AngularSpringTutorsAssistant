import { UserProfileEditModel, 
    UserProfileModel } from "src/app/models/user-profile.model";

export const userProfileData: UserProfileModel = {
    id: 1,
    user: {
        username: "Test User 1",
        id: 1
    },
    surname: "McTest",
    given_name: "Testy",
    contact_email: "testuser@gmx.com"
}

export const userProfileEditData: UserProfileEditModel = {
    surname: "Edited",
    given_name: "Altered",
    contact_email: "updated@gmx.com"
}

export const userProfileEdited: UserProfileModel = {
    id: 1,
    user: {
        username: "Test User 1",
        id: 1
    },
    surname: "Edited",
    given_name: "Altered",
    contact_email: "updated@gmx.com"
}
