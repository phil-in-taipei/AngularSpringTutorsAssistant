import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpEventType } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

import { AuthService } from './auth.service'

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const customReq = request.clone({
    //});
    //return next.handle(customReq);
    console.log('Outgoing request');
    console.log(request.url)
    return next.handle(request).pipe(tap(event => { //|| event.body.messages.message === 'Token is invalid or expired')
      if (event.type === HttpEventType.Response) {
        console.log(`Response received; status: ${event.status}`)
        if (event.body.detail === 'Given token not valid for any token type') //response.data.detail === 'Invalid token.'
         {
          this.authService.logout();
        }
      }
    }));
  }
}