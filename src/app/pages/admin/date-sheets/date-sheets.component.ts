import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {DateSheetService} from '@app/services';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {takeWhile} from 'rxjs/operators';
import * as Enums from '@app/app.enums';

@Component({
  selector: 'app-date-sheets',
  templateUrl: './date-sheets.component.html',
  styleUrls: ['./date-sheets.component.scss']
})
export class DateSheetsComponent implements OnInit, OnDestroy {

  alive = true;
  dateSheets = [];
  isLoading = true;
  selectedBoard: any;
  selectedBoardKey: any;
  dateSheetSearchQuery = '';

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private dateSheetService: DateSheetService) {

    this.route.params.pipe(takeWhile(this.isAlive)).subscribe(params => {

      if (params) {

        this.selectedBoardKey = params.boardKey;

        this.selectedBoard = this.selectedBoardKey.replace(/-/g, ' ');

        this.getDateSheetsByBoardKey();

      }

    });

  }

  ngOnInit() {}

  isAlive = () => {

    return this.alive;

  }

  getDateSheetsByBoardKey() {

    this.isLoading = true;

    this.dateSheetService.getDateSheetsByBoardKey(this.selectedBoardKey)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response && response.success && response.data) {

                this.dateSheets = response.data.dateSheets;

                this.parseDateSheetsData(this.dateSheets);

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

  parseDateSheetsData(dateSheets) {

    if (Array.isArray(dateSheets)) {

      dateSheets.forEach(dateSheet => {

        if (dateSheet) {

          dateSheet.sectionTitle = dateSheet.section && dateSheet.section.title;

          dateSheet.examTypeText = this.extractExamType(dateSheet.examType);

        }

      });

    }

  }

  editDateSheet(dateSheetId) {

    this.router.navigate(['/rs-admin/add-dateSheet', {dateSheetId: dateSheetId, board: this.selectedBoardKey}]);

  }

  removeDateSheet(dateSheet: any) {

    const confirmed = confirm('Are you sure you want to remove?');

    if (!confirmed || !dateSheet) {

      return;

    }

    const dateSheetToRemove = prompt('Enter name of year to remove date sheet');

    if (dateSheetToRemove !== dateSheet.year) {

      return;

    }

    this.isLoading = true;

    this.dateSheetService.deleteDateSheet(dateSheet._id)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response && response.success) {

                this.dateSheets.forEach((res, index) => {

                  if (res._id === dateSheet._id) {

                    this.dateSheets.splice(index, 1);

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
