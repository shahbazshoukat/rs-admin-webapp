import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '@app/services';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit, OnDestroy {
  public focus;
  public listTitles: any[];
  public location: Location;
  public username;
  isLoading = false;
  logoutSubscription$: any;
  constructor(location: Location,  private element: ElementRef, private router: Router,
              private userService: UsersService,
              private alertService: AlertService) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.username = localStorage.getItem('username');
  }
  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
        titlee = titlee.slice( 1 );
    }

    for (let item = 0; item < this.listTitles.length; item++) {
        if (this.listTitles[item].path === titlee) {
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
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
