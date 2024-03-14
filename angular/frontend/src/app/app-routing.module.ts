import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';
import { ContactComponent } from './contact/contact.component';
import { InformationComponent } from './information/information.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'info', component: InformationComponent },
  { path: 'authenticated-user', 
    loadChildren: () => import(
      './authenticated-user/authenticated-user.module')
      .then(m => m.AuthenticatedUserModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
