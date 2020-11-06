import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { NewsService } from '@app/services/news.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {

  news = [];
  alive = true;
  isLoading = true;
  isSearching = false;
  newsSearchQuery = '';

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private newsService: NewsService,
              private alertService: AlertService) { }

  ngOnInit() {

    this.isLoading = true;

    this.newsService.getAllNews().pipe(takeWhile(this.isAlive)).subscribe(
        response => {

          if (response.success && response.data) {

            this.news = response.data;

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

  removeNews(newsToRemove: any) {

    const confirmed = confirm('Are you sure you want to remove?');

    if (!confirmed || !newsToRemove) {

      return;

    }

    this.isLoading = true;

    this.newsService.deleteNews(newsToRemove._id).pipe(takeWhile(this.isAlive))
        .subscribe(
        response => {

          if (response.success && response.message && response.data) {

            this.news.forEach((nw, index) => {

              if (nw._id === newsToRemove._id) {

                this.news.splice(index, 1);

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
