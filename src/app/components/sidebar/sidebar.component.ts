import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/user.service';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';
import { AnimationOptions } from 'ngx-lottie';
import { environment as ENV } from '@env/environment';
import * as RSEnums from '@app/app.enums';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    // { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    // { path: 'results', title: 'Results',  icon: 'ni-planet text-blue', class: '' },
    { path: 'boards', title: 'Boards',  icon: 'ni-pin-3 text-orange', class: '' },
    { path: 'classes', title: 'Classes',  icon: 'ni-single-02 text-yellow', class: '' },
    { path: 'news', title: 'News',  icon: 'ni-single-02 text-yellow', class: '' },
    { path: 'users', title: 'Users',  icon: 'ni-single-02 text-yellow', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

    alive = true;
    menuItems: any[];
    isLoading = false;
    loggedInUser: any;
    isCollapsed = true;
    userRoleEnums = RSEnums.USER_ROLE;

    loadingAnimOptions: AnimationOptions = {
        path: '/assets/lib/loading-spinner.json',
        loop: true,
        autoplay: true
    };

    constructor(private router: Router,
              private userService: UsersService,
              private alertService: AlertService) { }

    ngOnInit() {

        const appState = JSON.parse(localStorage.getItem(ENV.stores.appState));

        this.loggedInUser = appState.user;

        this.menuItems = ROUTES.filter(menuItem => menuItem);

        this.router.events.subscribe((event) => {

          this.isCollapsed = true;

        });

    }

    isAlive = () => {

      return true;

    }

    logout() {

        this.isLoading = true;

        this.userService.logout().pipe(takeWhile(this.isAlive)).subscribe(
            response => {

                if (response && response.success) {

                    this.alertService.success(response.message);

                    localStorage.clear();

                    this.router.navigate(['/login']);

                }

                this.isLoading = false;

            },
            error => {

                this.isLoading = false;

                if (error && error.error && error.error.message) {

                    this.alertService.danger(error.error.message);

                }

            });

    }

    ngOnDestroy() {

        this.alive = false;

    }

}
