import {Component, OnDestroy, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '@app/services';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AlertService } from 'ngx-alerts';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  nameValid = false;
  emailValid = false;
  passwordValid = false;
  formStatus = false;
  isLoading = true;
  addUserSubscription$: any;
  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json'
  };
  errorMsg = '';
  successMsg = '';
  isError = false;
  isSuccess = false;

  loadingAnim: AnimationItem;

  constructor(private usersService: UsersService, private alertService: AlertService) { }

  ngOnInit() {
  }

  loadingAnimationCreated(animationItem: AnimationItem): void {

    this.loadingAnim = animationItem;

  }

  addUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.isError = false;
    this.errorMsg = '';
    this.successMsg = '';
    this.isSuccess = false;
    this.formStatus = true;
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (form.value.name === '') {
      this.nameValid = false;
    } else {
      this.nameValid = true;
    }
    if (form.value.email === '' ) {
      this.emailValid = false;
    } else if (!regexp.test(form.value.email)) {
      this.emailValid = false;
    } else {
      this.emailValid = true;
    }
    if (form.value.password === '' || form.value.password.length < 6) {
      this.passwordValid = false;
    } else {
      this.passwordValid = true;
    }
    if (this.nameValid && this.emailValid && this.passwordValid) {
      this.addUserSubscription$ = this.usersService.addUser(
        form.value.name,
        form.value.email,
        form.value.password
      ).subscribe(
        response => {
          this.alertService.success(response.message);
          if (response && response.message) {

            this.isSuccess = true;
            this.successMsg = response.message;

          }
          this.isLoading = false;
        },
        error => {
          console.log(error);
          this.isError = true;
          this.isLoading = false;
          if (error && error.error && error.error.message) {
            this.alertService.danger(error.error.message);
            this.errorMsg = error.error.message;
          }
        });
    } else {
      return;
    }

    this.isLoading = false;

    form.resetForm();
    this.formStatus = false;
  }

  ngOnDestroy(): void {
    this.addUserSubscription$ && this.addUserSubscription$.unsubscribe();
  }
}
