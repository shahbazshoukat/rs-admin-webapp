import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '@app/services';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { AnimationOptions } from 'ngx-lottie';
import { takeWhile } from 'rxjs/operators';
import {environment as ENV} from '@env/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  alive = true;
  errorMsg = '';
  isError = false;
  isLoading = false;

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private usersService: UsersService,
              private alertService: AlertService) {}

  ngOnInit() {

    const appState = JSON.parse(localStorage.getItem(ENV.stores.appState));

    if (appState && appState.user && appState.user.token) {

      this.router.navigate(['/rs-admin/boards']);

    }

  }

  isAlive = () => {

    return this.alive;

  }

  loginUser(form: NgForm) {

    if (!form || form.invalid) {

      return;

    }

    this.isLoading = true;

    this.isError = false;

    this.errorMsg = '';

    this.usersService.loginUser(form.value.email, form.value.password)
        .pipe(takeWhile(this.isAlive))
        .subscribe(response => {

          if (response && response.success && response.data) {

            this.saveUserData(response.data);

            this.router.navigate(['/rs-admin/boards']);

          }

          this.isLoading = false;

      },
      error => {

          this.isError = true;

          this.isLoading = false;

          if (error && error.error && error.error.message) {

            this.alertService.danger(error.error.message);

            this.errorMsg = error.error.message;

          }

      });

  }

  saveUserData(user) {

    if (user) {

      const appState = {
        loggedIn: true,
        user
      };

      localStorage.setItem('appState', JSON.stringify(appState));

    }

  }

  ngOnDestroy() {

    this.alive = false;

  }

}
