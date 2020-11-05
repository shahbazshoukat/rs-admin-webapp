import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/user.service';
import { AlertService } from 'ngx-alerts';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    // { path: 'results', title: 'Results',  icon: 'ni-planet text-blue', class: '' },
    { path: 'boards', title: 'Boards',  icon: 'ni-pin-3 text-orange', class: '' },
    { path: 'classes', title: 'Classes',  icon: 'ni-single-02 text-yellow', class: '' },
    { path: 'news', title: 'News',  icon: 'ni-single-02 text-yellow', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public menuItems: any[];
  public isCollapsed = true;
  logoutSubscription$: any;
  isLoading = false;

  constructor(private router: Router, private userService: UsersService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  logout() {

    this.isLoading = true;
    this.logoutSubscription$ = this.userService.logout().subscribe(
      response => {
        if (response && response.message) {
          this.alertService.success(response.message);
          this.isLoading = false;
          this.router.navigate(['']);
        }
      },
      error => {
        if (error && error.error && error.error.message) {

          this.alertService.danger(error.error.messages);

          this.isLoading = false;

        }
      }
    );
    localStorage.clear();
  }

  ngOnDestroy() {
    this.logoutSubscription$ && this.logoutSubscription$.unsubscribe();
  }


}
