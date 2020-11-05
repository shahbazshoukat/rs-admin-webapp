import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClassService } from '@app/services';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';
import * as RSEnums from '@app/app.enums';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit, OnDestroy {

  classes = [];
  alive = true;
  isLoading = true;
  isSearching = false;
  classSearchQuery = '';

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private classService: ClassService,
              private alertService: AlertService) { }

  ngOnInit() {

    this.isLoading = true;

    this.classService.getAllClasses().pipe(takeWhile(this.isAlive)).subscribe(
        response => {

          if (response.success && response.data) {

            this.classes = response.data;

            this.parseClassesData(this.classes);

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

  parseClassesData(classes) {

    if (Array.isArray(classes)) {

      classes.forEach(clas => {

        if (clas.type === RSEnums.CLASS_TYPE.CLASS) {

          clas.classType = 'Class';

        } else if (clas.type === RSEnums.CLASS_TYPE.TEST) {

          clas.classType = 'Test';

        }

      });

    }
  }

  isAlive = () => {

    return this.alive;

  }

  removeClass(classToRemove: any) {

    const confirmed = confirm('Are you sure you want to remove?');

    if (!confirmed || !classToRemove) {

      return;

    }

    this.isLoading = true;

    this.classService.deleteClass(classToRemove._id).pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.success && response.message && response.data) {

                this.classes.forEach((cls, index) => {

                  if (cls._id === classToRemove._id) {

                    this.classes.splice(index, 1);

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
