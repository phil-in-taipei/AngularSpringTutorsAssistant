import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthErrorInterceptor } from './authentication/auth.error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {RouterStateSerializer, StoreRouterConnectingModule} from "@ngrx/router-store";
import { EffectsModule } from '@ngrx/effects';
import { CustomSerializer } from './shared-utils/router-state.util';

import { LoginComponent } from './login/login.component';
import { UnauthenticatedHeaderComponent } from './unauthenticated-layout/unauthenticated-header/unauthenticated-header.component';
import { UnauthenticatedFooterComponent } from './unauthenticated-layout/unauthenticated-footer/unauthenticated-footer.component';
import { ContactComponent } from './contact/contact.component';
import { InformationComponent } from './information/information.component';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UnauthenticatedHeaderComponent,
    UnauthenticatedFooterComponent,
    ContactComponent,
    InformationComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({stateKey:'router'})
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    {provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
