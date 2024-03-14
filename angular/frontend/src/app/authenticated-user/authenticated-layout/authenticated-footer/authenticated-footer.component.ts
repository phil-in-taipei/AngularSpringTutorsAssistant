import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../authentication/auth.service';

@Component({
  selector: 'app-authenticated-footer',
  templateUrl: './authenticated-footer.component.html',
  styleUrls: ['./authenticated-footer.component.css']
})
export class AuthenticatedFooterComponent implements OnInit {

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
