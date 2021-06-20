import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';
import { ModelPaperService } from '@app/services';

@Component({
  selector: 'app-model-papers',
  templateUrl: './model-papers.component.html',
  styleUrls: ['./model-papers.component.scss']
})
export class ModelPapersComponent implements OnInit, OnDestroy {

  alive = true;
  modelPapers = [];
  isLoading = true;
  selectedBoard: any;
  selectedBoardKey: any;
  modelPaperSearchQuery = '';

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private modelPaperService: ModelPaperService) {

    this.route.params.pipe(takeWhile(this.isAlive)).subscribe(params => {

      if (params) {

        this.selectedBoardKey = params.boardKey;

        this.selectedBoard = this.selectedBoardKey.replace(/-/g, ' ');

        this.getModelPapersByBoardKey();

      }

    });

  }

  ngOnInit() {}

  isAlive = () => {

    return this.alive;

  }

  getModelPapersByBoardKey() {

    this.isLoading = true;

    this.modelPaperService.getModelPapersByBoardKey(this.selectedBoardKey)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response && response.success && response.data) {

                this.modelPapers = response.data.modelPapers;

                this.parseModelPapersData(this.modelPapers);

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

  parseModelPapersData(modelPapers) {

    if (Array.isArray(modelPapers)) {

      modelPapers.forEach(modelPaper => {

        if (modelPaper) {

          modelPaper.sectionTitle = modelPaper.section && modelPaper.section.title;

        }

      });

    }

  }

  editModelPaper(modelPaperId) {

    this.router.navigate(['/rs-admin/add-model-paper', { modelPaperId: modelPaperId, board: this.selectedBoardKey }]);

  }

  removeModelPaper(modelPaper: any) {

    const confirmed = confirm('Are you sure you want to remove?');

    if (!confirmed || !modelPaper) {

      return;

    }

    const modelPaperToRemove = prompt('Enter name of subject to remove model paper');

    if (modelPaperToRemove !== modelPaper.subject) {

      return;

    }

    this.isLoading = true;

    this.modelPaperService.deleteModelPaper(modelPaper._id)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response && response.success) {

                this.modelPapers.forEach((res, index) => {

                  if (res._id === modelPaper._id) {

                    this.modelPapers.splice(index, 1);

                  }

                });

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

  ngOnDestroy() {

    this.alive = false;

  }

}
