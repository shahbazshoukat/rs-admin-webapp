import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ResultService } from '@app/services';
import { ClassService } from '@app/services';
import { BoardService } from '@app/services';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-add-result',
  templateUrl: './add-result.component.html',
  styleUrls: ['./add-result.component.scss']
})
export class AddResultComponent implements OnInit, OnDestroy {

  params: string[] = [];
  tags: string[] = [];
  classes = [];
  boards = [];
  resultToUpdate = null;
  resultToUpdateId = null;
  isEdit = false;
  isLoading = true;
  selectedBoard;
  paramSub: any;
  resultSub: any;
  classesSub: any;
  boardSub: any;
  addResultSub: any;
  updateResultSub: any;
  selectedBoardKey;
  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json'
  };

  loadingAnim: AnimationItem;

  constructor(private resultService: ResultService, private classService: ClassService,
    private boardService: BoardService, private route: ActivatedRoute,
    private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('board')) {

        this.selectedBoardKey = paramMap.get('board');

      }
      if (paramMap.has('resultId')) {
        this.resultToUpdateId = paramMap.get('resultId');
        this.resultSub = this.resultService.getResultById(this.resultToUpdateId).subscribe(
          response => {
          if (response.success && response.data) {
            this.isEdit = true;
            this.resultToUpdate = response.data;
            this.resultToUpdate.annDate = this.extractDate(this.resultToUpdate.announceDate);
            this.tags = this.resultToUpdate.tags;
            this.params = this.resultToUpdate.apiParams;
            this.isLoading = false;
          }
        },
        error => {
          this.isLoading = false;
          if (error && error.error && error.error.message) {
            this.alertService.danger(error.error.message);
          }
        });
      }

      if (paramMap.has('boardKey')) {

        this.selectedBoardKey = paramMap.get('boardKey');

      }
    });
    this.classesSub = this.classService.getAllClasses().subscribe(
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
    this.boardSub = this.boardService.getAllBoardes().subscribe(
      response => {
      if ( response.success && response.data) {
        this.boards = response.data;
        this.isLoading = false;
      }
    },
    error => {
      this.isLoading = false;
      if (error && error.error && error.error.message) {
        this.alertService.danger(error.error.message);
      }
    });
  }

  loadingAnimationCreated(animationItem: AnimationItem): void {

    this.loadingAnim = animationItem;

  }

  addTag(form: NgForm) {
    if (form.invalid) {
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
    this.isEdit = false;
    this.router.navigate(['/rs-admin/results', this.selectedBoardKey]);
  }

  addResult(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    if (form.value.status !== true) {
      form.value.status = false;
    }
    const announceData = form.value.announceDate;
    const annDate = new Date(announceData.year, announceData.month - 1, announceData.day);
    if (this.isEdit && this.resultToUpdateId) {
      // tslint:disable-next-line:max-line-length
      this.updateResultSub = this.resultService.updateResult(this.resultToUpdateId, form.value.status, form.value.clas, form.value.board, form.value.year, annDate, form.value.examType, form.value.resultUrl, this.tags ).subscribe(
        response => {
        if (response.success && response.message) {
          this.isLoading = false;
          this.alertService.success(response.message);
          this.isEdit = false;
          this.params = [];
          this.tags = [];
          this.router.navigate(['/rs-admin/results', this.selectedBoardKey]);
        }
      },
      error => {
        this.isLoading = false;
        if (error && error.error && error.error.message) {
          this.alertService.danger(error.error.message);
        }
      });
    } else {
      // tslint:disable-next-line:max-line-length
      this.addResultSub = this.resultService.addResult(null, form.value.status, form.value.clas, form.value.board, form.value.year, annDate, form.value.examType, form.value.resultUrl, this.tags ).subscribe(
        response => {
        if (response.success && response.message) {
          this.alertService.success(response.message);
          this.isLoading = false;
          this.params = [];
          this.tags = [];
          this.router.navigate(['/rs-admin/results', this.selectedBoardKey]);
        }
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

  changeBoard(event) {

    if (event) {

      const boardId = event.target.value;

      this.boardSub = this.boardService.getBoardById(boardId).subscribe(
        response => {
          this.selectedBoard = response.data;
          this.params = this.selectedBoard.apiParams;
          this.tags = this.selectedBoard.tags;
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

  ngOnDestroy() {

    this.paramSub && this.paramSub.unsubscribe();
    this.resultSub && this.resultSub.unsubscribe();
    this.boardSub && this.boardSub.unsubscribe();
    this.classesSub && this.classesSub.unsubscribe();
    this.addResultSub && this.addResultSub.unsubscribe();
    this.updateResultSub && this.updateResultSub.unsubscribe();

  }

}
