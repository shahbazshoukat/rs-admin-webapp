import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResultService } from '@app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AlertService } from 'ngx-alerts';
import * as Enums from '@app/app.enums';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {

  alive = true;
  results = [];
  isLoading = true;
  selectedBoard: any;
  selectedBoardKey: any;
  resultSearchQuery = '';

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private resultService: ResultService, private router: Router, private alertService: AlertService,
              private route: ActivatedRoute) {

    this.route.params.pipe(takeWhile(this.isAlive)).subscribe(params => {

      if (params) {

        this.selectedBoardKey = params.boardKey;

        this.selectedBoard = this.selectedBoardKey.replace(/-/g, ' ');

        this.getResultsByBoardKey();

      }

    });

  }

  ngOnInit() {}

  isAlive = () => {

    return this.alive;

  }

  getResultsByBoardKey() {

    this.isLoading = true;

    this.resultService.getResultsByBoardKey(this.selectedBoardKey)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
        response => {

          if (response && response.success && response.data) {

            this.results = response.data;

            this.parseResultsData(this.results);

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

  parseResultsData(results) {

    if (Array.isArray(results)) {

      results.forEach(result => {

        if (result) {

          result.sectionTitle = result.section && result.section.title;

          result.examTypeText = this.extractExamType(result.examType);

        }

      });

    }

  }

  editResult(resultId) {

    this.router.navigate(['/rs-admin/add-result', {resultId: resultId, board: this.selectedBoardKey}]);

  }

  removeResult(result: any) {

    const confirmed = confirm('Are you sure you want to remove?');

    if (!confirmed || !result) {

      return;

    }

    const resultToRemove = prompt('Enter name of year to remove result');

    if (resultToRemove !== result.year) {

      return;

    }

    this.isLoading = true;

    this.resultService.deleteResult(result._id)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
      response => {

        if (response && response.success) {

          this.results.forEach((res, index) => {

            if (res._id === result._id) {

              this.results.splice(index, 1);

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

  changeResultStatus(result: any) {

    if (!result) {

      return;

    }

    this.isLoading = true;

    this.resultService.changeResultStatus(result._id, !result.status)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
      response => {

        if (response.success && response.message) {

          const resultToUpdate = this.results && this.results.find((res: any) => res && res._id === result._id);

          if (resultToUpdate) {

            resultToUpdate.status = !result.status;

          }

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

  extractExamType(exam) {

    if (exam === Enums.EXAM_TYPE.ANNUAL) {

      return 'Annual';

    } else if (exam === Enums.EXAM_TYPE.SUPPLY) {

      return 'Supply';

    } else if (exam === Enums.EXAM_TYPE.TEST) {

      return 'Test';

    }

  }

  ngOnDestroy() {

    this.alive = false;

  }

}
