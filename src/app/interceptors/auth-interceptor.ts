import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = localStorage.getItem('token');
    if (authToken) {

      const authRequest = req.clone({ setHeaders: { 'x-access-token': authToken } });
      return next.handle(authRequest);

    } else {

      const authRequest = req.clone({ setHeaders: { 'x-access-token': 'null' } });
      return next.handle(authRequest);

    }
  }
}
