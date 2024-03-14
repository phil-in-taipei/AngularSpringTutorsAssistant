import { UserProfileEditModel } from "./user-profile.model";

export interface UserRegistrationModel {
    username: string;
    password: string;
    re_password: string;
    profile: UserProfileEditModel;
 }

 export interface UserRegistrationResponseModel {
    message?: string;
    detail?: string;
 }