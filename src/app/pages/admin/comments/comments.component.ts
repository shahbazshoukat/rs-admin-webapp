import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClassService } from '@app/services';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AlertService } from 'ngx-alerts';
import { ResultService } from '@app/services';
import { BoardService } from '@app/services';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {


  comments = [];
  filteredComments = [];
  isSearching = false;
  isLoading = true;
  removeCommentSub: any;
  paramSubscription$: any;
  boardSubscription$: any;
  resultSubscription$: any;
  selectedBoardId: any;
  selectedResultId: any;
  isBoard = false;
  isResult = false;
  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json'
  };

  loadingAnim: AnimationItem;

  constructor(private classService: ClassService, private router: Router,
              private alertService: AlertService,
              private route: ActivatedRoute,
              private resultService: ResultService,
              private boardService: BoardService) { }

  ngOnInit() {


    this.paramSubscription$ = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('boardId')) {

        this.selectedBoardId = paramMap.get('boardId');
        this.isBoard = true;
        this.getBoardComments();

      } else if (paramMap.has('resultId')) {

        this.selectedResultId = paramMap.get('resultId');
        this.isResult = true;
        this.getResultComments();

      }
    });
  }

  getBoardComments() {

    if (this.selectedBoardId) {

      this.isLoading = true;

      this.boardSubscription$ = this.boardService.getBoardById(this.selectedBoardId).subscribe(
        response => {
          if (response.success && response.data) {
            if (response.data.comments) {
              this.comments = response.data.comments;
              this.filteredComments = this.comments;
            }
          }
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          if (error && error.error && error.error.message) {
            this.alertService.danger(error.error.message);
          }
        }
      );

    }

  }

  getResultComments() {

    if (this.selectedResultId) {

      this.isLoading = true;

      this.resultSubscription$ = this.resultService.getResultById(this.selectedResultId).subscribe(
        response => {
          if (response.success && response.data) {
            if (response.data.comments) {
              this.comments = response.data.comments;
              this.filteredComments = this.comments;
            }
          }
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          if (error && error.error && error.error.message) {
            this.alertService.danger(error.error.message);
          }
        }
      );

    }

  }

  loadingAnimationCreated(animationItem: AnimationItem): void {

    this.loadingAnim = animationItem;

  }

  removeComment(commentId: string) {
    const isConfirmed = confirm('Are you sure?');
    if (isConfirmed) {

      if (this.isBoard) {

        this.removeBoardComment(commentId);

      } else if (this.isResult) {

        this.removeResultComment(commentId);

      }

    }

  }

  removeBoardComment(commentId) {

    this.removeCommentSub = this.boardService.removeComment(this.selectedBoardId, commentId).subscribe(
      response => {
        if (response.success && response.message && response.data) {
          const index = this.comments.indexOf(comm => comm._id === commentId);
          this.comments.splice(index, 1);
          this.isLoading = false;
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

  removeResultComment(commentId) {

    this.removeCommentSub = this.resultService.removeComment(this.selectedResultId, commentId).subscribe(
      response => {
        if (response.success && response.message && response.data) {
          const index = this.comments.indexOf(comm => comm._id === commentId);
          this.comments.splice(index, 1);
          this.isLoading = false;
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

  searchComments(event) {

    this.isSearching = true;

    const searchQuery = event.target.value.toLowerCase();

    this.filteredComments = this.comments.filter(comment => {

      return comment.name.toLowerCase().includes(searchQuery) || comment.text.toLowerCase().includes(searchQuery);

    });

  }

  ngOnDestroy() {

   this.removeCommentSub && this.removeCommentSub.unsubscribe();
   this.paramSubscription$ && this.paramSubscription$.unsubscribe();
   this.boardSubscription$ && this.boardSubscription$.unsubscribe();
   this.resultSubscription$ && this.resultSubscription$.unsubscribe();

  }

}
