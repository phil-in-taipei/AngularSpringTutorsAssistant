import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AuthenticatedUserRoutingModule } from './authenticated-user-routing.module';
import { AuthenticatedUserComponent } from './authenticated-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthenticatedHeaderComponent } from './authenticated-layout/authenticated-header/authenticated-header.component';
import { AuthenticatedFooterComponent } from './authenticated-layout/authenticated-footer/authenticated-footer.component';
import { UserEffects } from './user.effects';
import { userProfileReducer } from './user.reducers';
import { EditProfileFormComponent } from './user-profile/edit-profile-form/edit-profile-form.component';

@NgModule({
  declarations: [
    AuthenticatedUserComponent,
    UserProfileComponent,
    AuthenticatedHeaderComponent,
    AuthenticatedFooterComponent,
    EditProfileFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthenticatedUserRoutingModule,
    StoreModule.forFeature('user', userProfileReducer),
    EffectsModule.forFeature([UserEffects]),
  ]
})
export class AuthenticatedUserModule { }
