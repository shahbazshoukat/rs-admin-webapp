import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService, ClassService, ModelPaperService } from '@app/services';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import * as Enums from '@app/app.enums';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-add-model-paper',
  templateUrl: './add-model-paper.component.html',
  styleUrls: ['./add-model-paper.component.scss']
})
export class AddModelPaperComponent implements OnInit, OnDestroy {

  boards = [];
  alive = true;
  classes = [];
  postToFb = false;
  postText: string;
  isLoading = false;
  fileToUpload: any;
  selectedBoard: any;
  tags: string[] = [];
  modelPaperId: string;
  selectedBoardKey: any;
  params: string[] = [];
  subjects = Enums.SUBJECT;
  modelPaperToUpdate = null;

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
              private modelPaperService: ModelPaperService) {

    this.route.params.pipe(takeWhile(this.isAlive)).subscribe(params => {

      if (params) {

        this.modelPaperId = params.modelPaperId;

        if (this.modelPaperId) {

          this.getModelPaperById(this.modelPaperId);

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

  getModelPaperById(modelPaperId) {

    this.modelPaperService.getModelPaperById(modelPaperId)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response && response.success && response.data) {

                this.modelPaperToUpdate = response.data;

                this.tags = this.modelPaperToUpdate.tags;

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

    this.router.navigate(['/rs-admin/model-papers', this.selectedBoardKey]);

  }

  submitForm(form: NgForm) {

    if (this.modelPaperId) {

      this.updateModelPaper(form);

    } else {

      this.addModelPaper(form);

    }

  }

  addModelPaper(form: NgForm) {

    if (!form || form.invalid || !form.value) {

      return;

    }

    if (form.value.status !== true) {

      form.value.status = false;

    }

    const modelPaperDate = {
      sectionId: form.value.section,
      boardId: form.value.board,
      subject: form.value.subject,
      description: form.value.description,
      tags: this.tags,
      postToFb: this.postToFb,
      postText: form.value.postText
    };

    this.isLoading = true;

    this.modelPaperService.addModelPaper(modelPaperDate, this.fileToUpload)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.success && response.message) {

                this.alertService.success(response.message);

                this.params = [];

                this.tags = [];

                this.router.navigate(['/rs-admin/model-papers', this.selectedBoardKey]);

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

  updateModelPaper(form: NgForm) {

    if (!form || form.invalid || !form.value) {

      return;

    }

    if (form.value.status !== true) {

      form.value.status = false;

    }

    const modelPaperDate = {
      sectionId: form.value.section,
      boardId: form.value.board,
      subject: form.value.subject,
      description: form.value.description,
      tags: this.tags,
      postToFb: this.postToFb,
      postText: form.value.postText
    };

    this.isLoading = true;

    this.modelPaperService.updateModelPaper({ modelPaperId: this.modelPaperId }, modelPaperDate)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response && response.success && response.message) {

                this.alertService.success(response.message);

                this.params = [];

                this.tags = [];

                this.router.navigate(['/rs-admin/model-papers', this.selectedBoardKey]);

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
