import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResultService } from '@app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AlertService } from 'ngx-alerts';
import * as Enums from '@app/app.enums';
import { takeWhile } from 'rxjs/operators';
import {NgForm} from '@angular/forms';

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

            this.results = response.data.results;

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

  createResultCopy(result) {

    if (result) {

      const newYear = (Number(result.year) + 1).toString();

      const tags = [];

      if (Array.isArray(result.tags)) {

        result.tags.forEach(tag => {

          if (tag) {

            tags.push(tag.replace(result.year, newYear));

          }

        })

      }

      result.tags = tags;

      result.year = newYear

      result.views = 0;

      if (result.announceDate) {

        const announceDate = new Date(result.announceDate)

        announceDate.setFullYear(announceDate.getFullYear() + 1);

        result.announceDate = announceDate;

      }

      result.sectionId = result.section && result.section._id;

      result.boardId = result.board && result.board._id;

      console.log(result);

      this.addResult(result);

    }

  }

  addResult(result) {

    if (!result) {

      return;

    }

    if (result.status !== true) {

      result.status = false;

    }

    const announceData = result.announceDate;

    const annDate = new Date(announceData.year, announceData.month - 1, announceData.day);

    this.isLoading = true;

    this.resultService.addResult(null, result.status, result.sectionId, result.boardId, result.year, result.announceDate,
        result.examType, result.resultUrl, result.description, result.tags, result.showAnnouncedDate)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.success && response.message) {

                this.alertService.success(response.message);

                // this.getResultsByBoardKey();

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
