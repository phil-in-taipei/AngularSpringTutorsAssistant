import { UserRegistrationModel, 
    UserRegistrationResponseModel } from '../../models/user-registration.model';

export const userRegistrationData: UserRegistrationModel = {
    "username": "UserDude",
    "password": "testpassword",
    "re_password": "testpassword",
    "profile": {
        "contact_email": "testmail@gmx.com",
        "surname": "Surname",
        "given_name": "GivenName",
    }
}


export const httpRegistrationResponseFailure1: UserRegistrationResponseModel = {
    "detail": "JSON parse error - Expecting value: line 9 column 5 (char 234)s",
}

export const httpRegistrationResponseFailure2: UserRegistrationResponseModel = {
    "message": "Error creating user!",
}

export const httpRegistrationResponseSuccess: UserRegistrationResponseModel = {
    "message": "User successfully created!",
}

