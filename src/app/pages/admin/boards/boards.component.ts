import { Component, OnInit, OnDestroy } from '@angular/core';
import { BoardService } from '@app/services';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit, OnDestroy {


  isLoading = true;
  boards = [];
  filteredBoards = [];
  boardSub: any;
  removeBoardSub: any;
  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json'
  };

  loadingAnim: AnimationItem;

  constructor(private boardService: BoardService, private router: Router, private alertService: AlertService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.boardSub = this.boardService.getAllBoardes().subscribe(
      response => {
      if (response.success && response.data) {
        this.boards = response.data;
        this.filteredBoards = this.boards;
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

  removeBoard(board) {

    const confirmed = confirm('Are you sure you want to remove?');

    if (!confirmed) {

      return;

    }

    const boardToRemove = prompt('Enter name of board to remove');

    if (boardToRemove !== board.title) {

      return;

    }

    this.isLoading = true;
    this.removeBoardSub = this.boardService.deleteBoard(board._id).subscribe(
      response => {
      if (response.success && response.message && response.data) {
       this.boards.forEach((brd, index) => {
         if (brd._id === board._id) {
            this.boards.splice(index, 1);
         }
       });
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

  editBoard(boardId: any) {
    this.router.navigate(['/rs-admin/add-board', {boardId: boardId}]);
  }

  searchBoards(event) {

    const searchQuery = event.target.value.toLowerCase();

    this.filteredBoards = this.boards.filter(board => {

      return board.title.toLowerCase().includes(searchQuery) || board.province.toLowerCase().includes(searchQuery)
        || board.city.toLowerCase().includes(searchQuery);

    });

  }

  ngOnDestroy() {

    this.boardSub && this.boardSub.unsubscribe();
    this.removeBoardSub && this.removeBoardSub.unsubscribe();

  }

}
