import { AuthLoginModel, AuthLoginResponseModel, 
    AuthLoginResponseFailureModel,
    AuthTokenRefreshResponseModel } from '../../models/auth-login.model';
import { AuthDataModel } from '../../models/auth-data.model';


export const authData: AuthDataModel = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MTgyODQ3NSwiaWF0IjoxNjkxODI4Mjk1LCJqdGkiOiJmZDZiOTFhMzI1OTY0ZWVkYThiMzFkOGUzZDc5NjllZCIsInVzZXJfaWQiOjExfQ.TyLkjur3cgeC85Tyjq0W45E9iawWs-sV1JPRImLfMuQ',
    accessExpDate: new Date(),
    refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkxODI4MzU1LCJpYXQiOjE2OTE4MjgyOTUsImp0aSI6ImQwNjZlYzU3ZDhkMTRlZDM4OTVlMTVkMjhiMGFhNjUxIiwidXNlcl9pZCI6MTF9.w2ZvyAiwUFH9jKJoHZisiQZkUPMRak7hW-h1Wnc7hHo',  
    refreshExp: new Date(),
};

export const loginData: AuthLoginModel = {
    username: 'testusername',
    password: 'testpassword',
  };

export const httpTokenResponseFailure: AuthLoginResponseFailureModel = {
    "detail": "No active account found with the given credentials",
}

export const httpTokensResponse: AuthLoginResponseModel = {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MjA4Njg3NiwiaWF0IjoxNjkyMDg2Njk2LCJqdGkiOiJmYjgzNDVkMDZmN2U0MjliOGZhYmFkNzc2ZGJjZjUzOCIsInVzZXJfaWQiOjExfQ.msQd1NtLTbngWk2IIS8w6H1JSGP1C_vFcVIhOBpQcdM",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkyMDg2NzU2LCJpYXQiOjE2OTIwODY2OTYsImp0aSI6IjY0NWRkNDY4NWQxMDQwZmVhMTA4ZDUyOGZmZWU2M2M1IiwidXNlcl9pZCI6MTF9.jZDfjzcJwvDbfMYMwP3DdDRCYgkVbJ59bpAkuhfSsng"
};

export const httpTokenRefreshResponse1: AuthTokenRefreshResponseModel = {
    "access": "firstbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkyMDg2NzU2LCJpYXQiOjE2OTIwODY2OTYsImp0aSI6IjY0NWRkNDY4NWQxMDQwZmVhMTA4ZDUyOGZmZWU2M2M1IiwidXNlcl9pZCI6MTF9.jZDfjzcJwvDbfMYMwP3DdDRCYgkVbJ59bpAkuhfSsng"
};

export const httpTokenRefreshResponse2: AuthTokenRefreshResponseModel = {
    "access": "secndbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkyMDg2NzU2LCJpYXQiOjE2OTIwODY2OTYsImp0aSI6IjY0NWRkNDY4NWQxMDQwZmVhMTA4ZDUyOGZmZWU2M2M1IiwidXNlcl9pZCI6MTF9.jZDfjzcJwvDbfMYMwP3DdDRCYgkVbJ59bpAkuhfSsng"
};

export const httpTokenRefreshResponse3: AuthTokenRefreshResponseModel = {
    "access": "thirdbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkyMDg2NzU2LCJpYXQiOjE2OTIwODY2OTYsImp0aSI6IjY0NWRkNDY4NWQxMDQwZmVhMTA4ZDUyOGZmZWU2M2M1IiwidXNlcl9pZCI6MTF9.jZDfjzcJwvDbfMYMwP3DdDRCYgkVbJ59bpAkuhfSsng"
};
  
