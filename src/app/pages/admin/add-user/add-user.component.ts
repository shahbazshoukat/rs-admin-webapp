import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { UsersService } from '@app/services';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  alive = true;
  userId: string;
  userToEdit: any;
  isLoading = false;

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UsersService,
              private alertService: AlertService) {

    this.route.params.pipe(takeWhile(this.isAlive)).subscribe(params => {

      this.userId = params.userId;

      if (this.userId) {

        this.getUserById();

      }

    });

  }

  ngOnInit() {}

  isAlive = () => {

    return this.alive;

  }

  cancel() {

    this.router.navigate(['/rs-admin/users']);

  }

  submitForm(form: NgForm) {

    if (this.userId) {

      this.updateUser(form);

    } else {

      this.addUser(form);

    }

  }

  getUserById() {

    this.isLoading = true;

    this.userService.getUserById(this.userId)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.success && response.data) {

                this.userToEdit = response.data;

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

  addUser(form: NgForm) {

    if (form.invalid) {

      return;

    }

    this.isLoading = true;

    this.userService.addUser(form.value)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.success && response.message) {

                this.alertService.success(response.message);

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

  updateUser(form: NgForm) {

    if (form.invalid) {

      return;

    }

    this.isLoading = true;

    if (this.userId) {

      this.userService.updateUser(this.userId, form.value)
          .pipe(takeWhile(this.isAlive)).subscribe(
          response => {

            if (response.success && response.message) {

              this.alertService.success(response.message);

              this.router.navigate(['/rs-admin/users']);

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

    form.resetForm();

  }

  ngOnDestroy() {

    this.alive = false;

  }

}
