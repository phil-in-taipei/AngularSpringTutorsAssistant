import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthService } from '../authentication/auth.service';
import { UserProfileModel, 
  UserProfileEditModel } from '../models/user-profile.model'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  fetchUserProfile() {
    //console.log('fetching user profile ....');
    let token = this.authService.getAuthToken();
    return this.http.get<UserProfileModel>(
      `${environment.apiUrl}/api/profiles/user-profile/`,
      {
        headers: new HttpHeaders({ 'Authorization': `Token ${token}` })
      }).pipe(map((usrProfile: UserProfileModel) => {
        return usrProfile
      }));
  }

  editUserProfile(
    submissionForm:UserProfileEditModel) {
    //console.log('submitting revised user profile ....');
    let token = this.authService.getAuthToken();
    //console.log(token);
    return this.http.patch<UserProfileModel>(
      `${environment.apiUrl}/api/profiles/user-profile/`, submissionForm,
      {
        headers: new HttpHeaders({ 'Authorization': `Token ${token}` })
      }).pipe(map((usrProfile: UserProfileModel) => {
        return usrProfile
      }));
  }
}
