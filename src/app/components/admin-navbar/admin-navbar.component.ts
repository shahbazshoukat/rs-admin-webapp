import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTES } from '@app/components/sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '@app/services';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit, OnDestroy {

  alive = true;
  username: string;
  listTitles: any[];
  isLoading = false;
  location: Location;

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(location: Location,
              private router: Router,
              private userService: UsersService,
              private alertService: AlertService) {

    this.location = location;

  }

  ngOnInit() {

    this.listTitles = ROUTES.filter(listTitle => listTitle);

    const user = this.userService.getCurrentUser();

    this.username = user && user.name ? user.name : '';

  }

  isAlive = () => {

    return this.alive;

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
