export interface AuthLoginModel {
    username: string;
    password: string;
  }

export interface AuthLoginResponseModel {
    refresh: string;
    access: string;
};

export interface AuthLoginResponseFailureModel {
  detail: string;
};

export interface AuthTokenRefreshResponseModel {
  access: string;
};
  