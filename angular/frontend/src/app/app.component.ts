import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from './authentication/auth.service';
import { environment } from '../environments/environment';
//import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'frontend';
  //userIsAuthenticated = false;

  //private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {

    console.log("main app component initializing and calling autoAuthUser function");
    
    this.authService.autoAuthUser();

    console.log("Current API URL:", environment.apiUrl);
    
    //this.authListenerSubs = this.authService
    //  .getAuthStatusListener()
    //  .subscribe(isAuthenticated => {
    //    this.userIsAuthenticated = isAuthenticated;
    //});
  }
}
