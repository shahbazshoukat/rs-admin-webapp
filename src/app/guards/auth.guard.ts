import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment as ENV} from '@env/environment';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    const appState = JSON.parse(localStorage.getItem(ENV.stores.appState));

    if (!appState || !appState.user || !appState.user.token) {

      this.router.navigate(['/login']);

      return false;

    }

    return true;

  }

}
