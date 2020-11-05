import { Component, OnInit, OnDestroy } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgForm } from '@angular/forms';
import { ClassService } from '@app/services';
import { BoardService } from '@app/services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss']
})
export class AddBoardComponent implements OnInit, OnDestroy {

  examTypes = [];
  selectedExamTypes = [];
  examTypesSettings: IDropdownSettings = {};
  classes = [];
  params: string[] = [];
  tags: string[] = [];
  selectedClasses = [];
  selectedCls = [];
  classesSettings: IDropdownSettings = {};
  boardToUpdate = null;
  boardToUpdateId;
  isEdit = false;
  isLoading = true;
  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json'
  };

  loadingAnim: AnimationItem;
  paramsub: any;
  boardsub: any;
  classesSub: any;
  addBoardSub: any;
  updateBoardSub: any;

  constructor(private classService: ClassService, private boardService: BoardService,
              private route: ActivatedRoute, private router: Router,
              private alertService: AlertService) { }

  ngOnInit() {
    this.examTypes = [
      {_id: 0, title: 'Annual'},
      {_id: 1, title: 'Supply'},
      {_id: 2, title: 'Test'},
      {_id: 3, title: 'Retotal'},
    ];
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

    this.paramsub = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('boardId')) {
        this.isLoading = true;
        this.boardToUpdateId = paramMap.get('boardId');
        this.boardsub = this.boardService.getBoardById(this.boardToUpdateId).subscribe(
          response => {
          if (response.data && response.success) {
            this.boardToUpdate = response.data;
            this.isEdit = true;
            this.params = this.boardToUpdate.apiParams;
            this.tags = this.boardToUpdate.tags;
            this.selectedClasses = this.boardToUpdate.sections;
            this.selectedExamTypes = this.boardToUpdate.examTypes;
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
    });

    this.classesSub = this.classService.getAllClasses().subscribe(
      response => {
      if (response.data && response.success) {
        this.classes = response.data;
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
    this.tags.push(form.value.tagTitle);
  }

  removeTag(tag: any) {
    const index = this.tags.indexOf(tag, 0);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
  }

  cancel() {
    this.isEdit = false;
    this.router.navigate(['/rs-admin/boards']);
  }

  addBoard(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    this.selectedClasses.forEach(cls => {
      this.selectedCls.push(cls._id);
    });
    if (this.isEdit && this.boardToUpdateId) {
      // tslint:disable-next-line:max-line-length
      this.updateBoardSub = this.boardService.updateBoard(this.boardToUpdateId, form.value.key, form.value.title, form.value.province, form.value.city, this.selectedExamTypes, this.selectedCls, form.value.type,  form.value.webUrl, form.value.resultUrl, this.tags)
      .subscribe(response => {
        if (response) {
          this.isLoading = false;
          this.selectedClasses = [];
          this.selectedExamTypes = [];
          this.tags = [];
          this.params = [];
          this.isEdit = false;
          this.alertService.success(response.message);
        }
        if (response.success) {
          this.router.navigate(['/rs-admin/boards']);
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
      this.addBoardSub = this.boardService.addBoard(null, form.value.key, form.value.title, form.value.province, form.value.city, this.selectedExamTypes, this.selectedCls, form.value.type, form.value.webUrl, form.value.resultUrl, this.tags)
      .subscribe(
        response => {
        if (response) {
          this.isLoading = false;
          this.selectedClasses = [];
          this.selectedExamTypes = [];
          this.tags = [];
          this.params = [];
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
    form.resetForm();
  }

  ngOnDestroy() {

    this.paramsub && this.paramsub.unsubscribe();
    this.boardsub && this.boardsub.unsubscribe();
    this.classesSub && this.classesSub.unsubscribe();
    this.addBoardSub && this.addBoardSub.unsubscribe();
    this.updateBoardSub && this.updateBoardSub.unsubscribe();

  }
}
