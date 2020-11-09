import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment as ENV } from '@env/environment';
import { AlertService } from 'ngx-alerts';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private alertService: AlertService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const apiReq = req.clone({ url: `${window.location.origin}${req.url}` });

    return next.handle(this.setAuthorizationHeader(apiReq)).pipe(
        catchError((event) => {

          if (event instanceof HttpErrorResponse) {

            return this.catchErrors(event);

          }

        }));

  }

  // Request Interceptor
  private setAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {

    const appState = JSON.parse(localStorage.getItem(ENV.stores.appState));

    if (appState && appState.user && appState.user.token) {

      return req.clone({ setHeaders: { 'x-access-token': appState.user.token } });

    } else {

      return req.clone({ setHeaders: { 'x-access-token': '' } });

    }

  }

  // Response Interceptor
  private catchErrors(error: HttpErrorResponse): Observable<any> {

    if (!navigator.onLine) {

      this.alertService.danger(ENV.offlineError);

      this.logoutUser();

    } else {

      if (error.status === 401 ) {

        this.logoutUser();

      } else if (error.status === 500) {

        localStorage.clear();

        this.router.navigate(['/501']);

      } else if (error.status === 503 || error.status === 0 || error.status === 504) {

        localStorage.clear();

        this.router.navigate(['/501']);

      } else {

        this.alertService.danger('Unable to connect to server.');

      }

    }

    return observableThrowError(error);

  }

  logoutUser() {

    if (window.location.href.split('/').pop() !== 'login' && window.location.pathname !== '/login') {

      // this.socket.disconnect();
      localStorage.clear();

      // return to the page that was in use
      this.router.navigate(['/login']);

    }

  }

}
