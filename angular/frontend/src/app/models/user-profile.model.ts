export interface UserModel {
    username: string;
    id: number;
  }

  export interface UserProfileModel {
    id: number;
    user: UserModel;
    contact_email: string;
    surname: string;
    given_name: string;
  }
  
  export interface UserProfileEditModel {
    contact_email: string;
    surname: string;
    given_name: string;
  }