import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClassService } from 'src/app/services/class.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent implements OnInit, OnDestroy {

  alive = true;
  isEdit = false;
  classId: string;
  classToEdit: any;
  isLoading = false;

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private classService: ClassService,
              private alertService: AlertService) {

    this.route.params.pipe(takeWhile(this.isAlive)).subscribe(params => {

      this.classId = params.classId;

      if (this.classId) {

        this.getClassById();

      }

    });

  }

  ngOnInit() {}

  isAlive = () => {

    return this.alive;

  }

  cancel() {

    this.router.navigate(['/rs-admin/classes']);

  }

  submitForm(form: NgForm) {

    if (this.classId) {

      this.updateClass(form);

    } else {

      this.addClass(form);

    }

  }

  getClassById() {

    this.isLoading = true;

    this.classService.getClassById(this.classId)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.success && response.data) {

                this.classToEdit = response.data;

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

  addClass(form: NgForm) {

    if (form.invalid) {

      return;

    }

    this.isLoading = true;

    this.classService.addClass(form.value.title, form.value.type)
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

    form.resetForm();

  }

  updateClass(form: NgForm) {

    if (form.invalid) {

      return;

    }

    this.isLoading = true;

    if (this.classId) {

      this.classService.updateClass(this.classId, form.value.title, form.value.type)
          .pipe(takeWhile(this.isAlive)).subscribe(
          response => {

            if (response.success && response.message) {

              this.alertService.success(response.message);

              this.isEdit = false;

              this.router.navigate(['/rs-admin/classes']);

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
