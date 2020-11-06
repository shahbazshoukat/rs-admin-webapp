import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '@app/services';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { User} from '@app/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  loginSubscription$: any;
  logoutSubscription$: any;
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private user: User;
  errorMsg = '';
  isError = false;

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json'
  };

  loadingAnim: AnimationItem;

  constructor(private usersService: UsersService, private router: Router,
              private alertService: AlertService) {}

  ngOnInit() {
  }

  loginUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.isError = false;
    this.errorMsg = '';
    this.loginSubscription$ = this.usersService.loginUser(form.value.email, form.value.password).subscribe(response => {
        const token = response.data.token;
        this.token = token;
        this.user = {
          _id: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          password: ''
        };

        if (token) {
          const expiresInDuration = response.data.expiresIn;
          console.log(expiresInDuration);
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(
            token,
            expirationDate,
            this.user.name,
            this.user._id
          );
          if (this.user && this.user.name) {
            this.usersService.setUserName(this.user.name);
          }
          this.isLoading = false;
          this.router.navigate(['/rs-admin/boards']);
        }
      },
      error => {

      this.isLoading = false;
      this.isError = true;

        console.log(error);
        this.alertService.success('error');

        if (error && error.error && error.error.message) {
          this.errorMsg = error.error.message;
          this.alertService.danger(error.error.message);
        }

      });
    this.isLoading = false;
    form.resetForm();
  }

  loadingAnimationCreated(animationItem: AnimationItem): void {

    this.loadingAnim = animationItem;

  }

  logout() {
    this.logoutSubscription$ = this.usersService.logout().subscribe(
      response => {

        this.alertService.success(response.message);

      },
      error => {

        console.log(error);

        if (error && error.error && error.error.message) {
          this.alertService.danger(error.error.message);
        }

      });
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.user = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    username: string,
    userId: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  }

  ngOnDestroy() {
    this.loginSubscription$ && this.loginSubscription$.unsubscribe();
    this.logoutSubscription$ && this.logoutSubscription$.unsubscribe();
  }

}
