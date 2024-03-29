import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ResultService } from '@app/services';
import { ClassService } from '@app/services';
import { BoardService } from '@app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-add-result',
  templateUrl: './add-result.component.html',
  styleUrls: ['./add-result.component.scss']
})
export class AddResultComponent implements OnInit, OnDestroy {

  boards = [];
  alive = true;
  classes = [];
  postToFb = false;
  postText: string;
  resultId: string;
  isLoading = false;
  selectedBoard: any;
  tags: string[] = [];
  copyResultId: string;
  selectedBoardKey: any;
  params: string[] = [];
  resultToUpdate = null;

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
              private resultService: ResultService) {

    this.route.params.pipe(takeWhile(this.isAlive)).subscribe(params => {

      if (params) {

        this.resultId = params.resultId;

        this.copyResultId = params.copyResultId;

        if (this.resultId) {

          this.getResultById(this.resultId);

        } else if (this.copyResultId) {

          this.getResultById(this.copyResultId);

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

  getResultById(resultId) {

    this.resultService.getResultById(resultId)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
        response => {

          if (response && response.success && response.data) {

            this.resultToUpdate = response.data;

            this.resultToUpdate.annDate = this.extractDate(this.resultToUpdate.announceDate);

            this.tags = this.resultToUpdate.tags;

            this.params = this.resultToUpdate.apiParams;

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

    this.router.navigate(['/rs-admin/results', this.selectedBoardKey]);

  }

  submitForm(form: NgForm) {

    if (this.resultId) {

      this.updateResult(form);

    } else {

      this.addResult(form);

    }

  }

  addResult(form: NgForm) {

    console.log(form);

    if (!form || !form.value) {

      return;

    }

    if (form.value.status !== true) {

      form.value.status = false;

    }

    const announceData = form.value.announceDate;

    const annDate = new Date(announceData.year, announceData.month - 1, announceData.day);

    const resultData = {
      status: typeof form.value.status === 'boolean' ? form.value.status : false,
      sectionId: form.value.clas,
      boardId: form.value.board,
      year: form.value.year,
      announceDate: annDate,
      examType: form.value.examType,
      resultUrl: form.value.resultUrl,
      description: form.value.description,
      tags: this.tags,
      showAnnouncedDate: typeof form.value.showAnnouncedDate === 'boolean' ? form.value.showAnnouncedDate : false,
      postToFb: this.postToFb,
      postText: form.value.postText
    };

    this.isLoading = true;

    this.resultService.addResult(resultData)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
        response => {

          if (response.success && response.message) {

            this.alertService.success(response.message);

            this.params = [];

            this.tags = [];

            this.router.navigate(['/rs-admin/results', this.selectedBoardKey]);

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

  updateResult(form: NgForm) {

    if (!form || !form.value) {

      return;

    }

    if (form.value.status !== true) {

      form.value.status = false;

    }

    const announceData = form.value.announceDate;

    const annDate = new Date(announceData.year, announceData.month - 1, announceData.day);

    const resultData = {
      status: form.value.status,
      sectionId: form.value.clas,
      boardId: form.value.board,
      year: form.value.year,
      announceDate: annDate,
      examType: form.value.examType,
      resultUrl: form.value.resultUrl,
      description: form.value.description,
      tags: this.tags,
      showAnnouncedDate: form.value.showAnnouncedDate,
      postToFb: this.postToFb,
      postText: form.value.postText
    };

    this.isLoading = true;

    this.resultService.updateResult({ resultId: this.resultId }, resultData)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
        response => {

          if (response && response.success && response.message) {

            this.alertService.success(response.message);

            this.params = [];

            this.tags = [];

            this.router.navigate(['/rs-admin/results', this.selectedBoardKey]);

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

    if (dateStr) {

      const date = new Date(dateStr);

      return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      };

    }

    return null;

  }

  ngOnDestroy() {

    this.alive = false;

  }

}
