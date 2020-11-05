import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { NgForm } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { NewsService } from '@app/services/news.service';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss']
})
export class AddNewsComponent implements OnInit, OnDestroy {

  alive = true;
  newsId: string;
  isEdit = false;
  newsToEdit: any;
  isLoading = false;

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private newsService: NewsService,
              private alertService: AlertService) {

    this.route.params.pipe(takeWhile(this.isAlive)).subscribe(params => {

      this.newsId = params.newsId;

      if (this.newsId) {

        this.getNewsById();

      }

    });

  }

  ngOnInit() {}

  isAlive = () => {

    return this.alive;

  }

  cancel() {

    this.router.navigate(['/rs-admin/news']);

  }

  submitForm(form: NgForm) {

    if (this.newsId) {

      this.updateNews(form);

    } else {

      this.addNews(form);

    }

  }

  getNewsById() {

    this.isLoading = true;

    this.newsService.getNewsById(this.newsId)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.success && response.data) {

                this.newsToEdit = response.data;

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

  addNews(form: NgForm) {

    if (form.invalid) {

      return;

    }

    this.isLoading = true;

    this.newsService.addNews(form.value.title, form.value.description)
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

  updateNews(form: NgForm) {

    if (form.invalid) {

      return;

    }

    this.isLoading = true;

    if (this.newsId) {

      this.newsService.updateNews(this.newsId, form.value.title, form.value.description)
          .pipe(takeWhile(this.isAlive)).subscribe(
          response => {

            if (response.success && response.message) {

              this.alertService.success(response.message);

              this.isEdit = false;

              this.router.navigate(['/rs-admin/news']);

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
