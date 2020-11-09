import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';
import { UsersService } from '@app/services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  users = [];
  alive = true;
  isLoading = true;
  isSearching = false;
  usersSearchQuery = '';

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private userService: UsersService,
              private alertService: AlertService) { }

  ngOnInit() {

    this.isLoading = true;

    this.userService.getAllUsers().pipe(takeWhile(this.isAlive)).subscribe(
        response => {

          if (response.success && response.data) {

            this.users = response.data;

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

  isAlive = () => {

    return this.alive;

  }

  removeUser(userToRemove: any) {

    const confirmed = confirm('Are you sure you want to remove?');

    if (!confirmed || !userToRemove) {

      return;

    }

    const email = prompt('Enter email of user to remove');

    if (email !== userToRemove.email) {

      return;

    }

    this.isLoading = true;

    this.userService.deleteUser(userToRemove._id).pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.success && response.message && response.data) {

                this.users.forEach((nw, index) => {

                  if (nw._id === userToRemove._id) {

                    this.users.splice(index, 1);

                  }

                });

                this.isLoading = false;

                this.alertService.success(response.message);

              }

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
