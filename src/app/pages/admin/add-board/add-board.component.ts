import { Component, OnInit, OnDestroy } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgForm } from '@angular/forms';
import { ClassService } from '@app/services';
import { BoardService } from '@app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss']
})
export class AddBoardComponent implements OnInit, OnDestroy {

  alive = true;
  classes = [];
  boardId: string;
  selectedCls = [];
  isLoading = false;
  tags: string[] = [];
  selectedClasses = [];
  boardToUpdate = null;
  params: string[] = [];
  selectedExamTypes = [];
  classesSettings: IDropdownSettings = {};
  examTypesSettings: IDropdownSettings = {};

  examTypes = [
    {_id: 0, title: 'Annual'},
    {_id: 1, title: 'Supply'},
    {_id: 2, title: 'Test'},
    {_id: 3, title: 'Retotal'},
  ];

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private classService: ClassService,
              private boardService: BoardService,
              private alertService: AlertService) {

    this.route.params.pipe(takeWhile(this.isAlive)).subscribe(params => {

      if (params) {

        this.boardId = params.boardId;

        if (this.boardId) {

          this.getBoardById();

        }

      }

    });

  }

  ngOnInit() {

    this.examTypesSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.classesSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.getAllClasses();

  }

  isAlive = () => {

    return this.alive;

  }

  getBoardById() {

    this.isLoading = true;

    this.boardService.getBoardById(this.boardId)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response.data && response.success) {

                this.boardToUpdate = response.data;

                this.params = this.boardToUpdate.apiParams;

                this.tags = this.boardToUpdate.tags;

                this.selectedClasses = this.boardToUpdate.sections;

                this.selectedExamTypes = this.boardToUpdate.examTypes;

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

              if (response.data && response.success) {

                this.classes = response.data;

              }

            },
            error => {

              if (error && error.error && error.error.message) {

                this.alertService.danger(error.error.message);

              }

            });

  }

  addTag(form: NgForm) {

    if (form && form.value && form.value.tagTitle) {

      this.tags.push(form.value.tagTitle);

    }

  }

  removeTag(tag: any) {

    const index = this.tags.indexOf(tag, 0);

    if (index > -1) {

      this.tags.splice(index, 1);

    }

  }

  cancel() {

    this.router.navigate(['/rs-admin/boards']);

  }

  submitForm(form: NgForm) {

    if (this.boardId) {

      this.updateBoard(form);

    } else {

      this.addBoard(form);

    }

  }

  addBoard(form: NgForm) {

    if (!form || form.invalid) {

      return;

    }

    this.selectedClasses.forEach(cls => {

      this.selectedCls.push(cls._id);

    });

    this.isLoading = true;

    this.boardService.addBoard(null, form.value.key, form.value.title, form.value.description, form.value.province, form.value.city,
        this.selectedExamTypes, this.selectedCls, form.value.type, form.value.webUrl, form.value.resultUrl, this.tags)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
            response => {

              if (response && response.success) {

                this.selectedClasses = [];

                this.selectedExamTypes = [];

                this.tags = [];

                this.params = [];

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

  updateBoard(form: NgForm) {

    if (!form || form.invalid) {

      return;

    }

    this.selectedClasses.forEach(cls => {

      this.selectedCls.push(cls._id);

    });

    this.isLoading = true;

    this.boardService.updateBoard(this.boardId, form.value.key, form.value.title, form.value.description, form.value.province,
        form.value.city, this.selectedExamTypes, this.selectedCls, form.value.type,  form.value.webUrl, form.value.resultUrl, this.tags)
        .pipe(takeWhile(this.isAlive))
        .subscribe(response => {

              if (response && response.success) {

                this.selectedClasses = [];

                this.selectedExamTypes = [];

                this.tags = [];

                this.params = [];

                this.alertService.success(response.message);

                this.router.navigate(['/rs-admin/boards']);

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
