import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../authentication/auth.service';

@Component({
  selector: 'app-authenticated-header',
  templateUrl: './authenticated-header.component.html',
  styleUrls: ['./authenticated-header.component.css']
})
export class AuthenticatedHeaderComponent implements OnInit {

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
  }

  onLogout() {
    this.authService.logout();
  }

}
