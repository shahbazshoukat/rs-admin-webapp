import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService, ClassService, DateSheetService } from '@app/services';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import {IDropdownSettings} from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-date-sheet',
  templateUrl: './add-date-sheet.component.html',
  styleUrls: ['./add-date-sheet.component.scss']
})
export class AddDateSheetComponent implements OnInit, OnDestroy {

  boards = [];
  alive = true;
  classes = [];
  postToFb = false;
  postText: string;
  selectedCls = [];
  isLoading = false;
  fileToUpload: any;
  selectedBoard: any;
  tags: string[] = [];
  dateSheetId: string;
  selectedClasses = [];
  selectedBoardKey: any;
  params: string[] = [];
  copyDateSheetId: string;
  dateSheetToUpdate = null;
  classesSettings: IDropdownSettings = {
    singleSelection: false,
    idField: '_id',
    textField: 'title',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private classService: ClassService,
              private boardService: BoardService,
              private alertService: AlertService,
              private dateSheetService: DateSheetService) {

    this.route.params.pipe(takeWhile(this.isAlive)).subscribe(params => {

      if (params) {

        this.dateSheetId = params.dateSheetId;

        this.copyDateSheetId = params.copydateSheetId;

        if (this.dateSheetId) {

          this.getDateSheetById(this.dateSheetId);

        } else if (this.copyDateSheetId) {

          this.getDateSheetById(this.copyDateSheetId);

        }

        this.selectedBoardKey = params.boardKey;

      }

    });

  }

  ngOnInit() {

    this.getAllClasses();

    this.getAllBoards();

  }

  isAlive = () => {

    return this.alive;

  }

  getDateSheetById(dateSheetId) {

    this.dateSheetService.getDateSheetById(dateSheetId)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response && response.success && response.data) {

                this.dateSheetToUpdate = response.data;

                this.tags = this.dateSheetToUpdate.tags;

                this.selectedClasses = this.dateSheetToUpdate.sections;

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

  getAllClasses() {

    this.classService.getAllClasses()
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.success && response.data) {

                this.classes = response.data;

              }

            },
            error => {

              this.isLoading = false;

              if (error && error.error && error.error.message) {

                this.alertService.danger(error.error.message);

              }

            });

  }

  getAllBoards() {

    this.boardService.getAllBoards()
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if ( response.success && response.data) {

                this.boards = response.data;

              }

            },
            error => {

              if (error && error.error && error.error.message) {

                this.alertService.danger(error.error.message);

              }

            });

  }

  addTag(form: NgForm) {

    if (!form || form.invalid || !form.value) {

      return;

    }

    this.tags.push(form.value.tagTitle);

    form.resetForm();

  }

  removeTag(tag: any) {

    const index = this.tags.indexOf(tag, 0);

    if (index > -1) {

      this.tags.splice(index, 1);

    }

  }

  cancel() {

    this.router.navigate(['/rs-admin/date-sheets', this.selectedBoardKey]);

  }

  submitForm(form: NgForm) {

    if (this.dateSheetId) {

      this.updateDateSheet(form);

    } else {

      this.addDateSheet(form);

    }

  }

  addDateSheet(form: NgForm) {

    if (!form || form.invalid || !form.value) {

      return;

    }

    this.selectedClasses.forEach(cls => {

      this.selectedCls.push(cls._id);

    });

    if (form.value.status !== true) {

      form.value.status = false;

    }

    const dateSheetDate = {
      sections: this.selectedCls,
      boardId: form.value.board,
      year: form.value.year,
      examType: form.value.examType,
      description: form.value.description,
      tags: this.tags,
      postToFb: this.postToFb,
      postText: form.value.postText
    };

    this.isLoading = true;

    this.dateSheetService.addDateSheet(dateSheetDate, this.fileToUpload)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.success && response.message) {

                this.alertService.success(response.message);

                this.selectedClasses = [];

                this.params = [];

                this.tags = [];

                this.router.navigate(['/rs-admin/date-sheets', this.selectedBoardKey]);

              }

              this.isLoading = false;

            },
            error => {

              this.isLoading = false;

              if (error && error.error && error.error.message) {

                this.alertService.danger(error.error.message);

              }

            });

    // form.resetForm();

  }

  updateDateSheet(form: NgForm) {

    if (!form || form.invalid || !form.value) {

      return;

    }

    this.selectedClasses.forEach(cls => {

      this.selectedCls.push(cls._id);

    });

    if (form.value.status !== true) {

      form.value.status = false;

    }

    const announceData = form.value.announceDate;

    const annDate = new Date(announceData.year, announceData.month - 1, announceData.day);

    const dateSheetDate = {
      sections: this.selectedCls,
      boardId: form.value.board,
      year: form.value.year,
      examType: form.value.examType,
      description: form.value.description,
      tags: this.tags,
      postToFb: this.postToFb,
      postText: form.value.postText
    };

    this.isLoading = true;

    this.dateSheetService.updateDateSheet({ dateSheetId: this.dateSheetId }, dateSheetDate)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response && response.success && response.message) {

                this.alertService.success(response.message);

                this.params = [];

                this.tags = [];

                this.selectedClasses = [];

                this.router.navigate(['/rs-admin/date-sheets', this.selectedBoardKey]);

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

  changeBoard(event) {

    if (event) {

      const boardId = event.target.value;

      this.boardService.getBoardById(boardId)
          .pipe(takeWhile(this.isAlive))
          .subscribe(
              response => {

                if (response && response.success) {

                  this.selectedBoard = response.data;

                  this.params = this.selectedBoard.apiParams;

                  this.tags = this.selectedBoard.tags;

                }

              },
              error => {

                this.isLoading = false;

                if (error && error.error && error.error.message) {

                  this.alertService.danger(error.error.message);

                }

              });

    }

  }

  extractDate(dateStr) {

    const date = new Date(dateStr);

    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };

  }

  onFileUpload = (event) => {

    this.fileToUpload = event && event.target && event.target.files[0];

  }

  ngOnDestroy() {

    this.alive = false;

  }

}
