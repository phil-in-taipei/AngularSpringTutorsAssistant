import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedUserComponent } from './authenticated-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: AuthenticatedUserComponent, children: [ 
    { path: 'user-profile', component: UserProfileComponent },
    {
      path: "**",
      redirectTo: '/user-profile'
    }
  ] },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthenticatedUserRoutingModule { }
