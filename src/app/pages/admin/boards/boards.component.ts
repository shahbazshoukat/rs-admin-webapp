import { Component, OnInit, OnDestroy } from '@angular/core';
import { BoardService } from '@app/services';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AlertService } from 'ngx-alerts';
import { takeWhile } from 'rxjs/operators';
import { environment as ENV } from '@env/environment';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit, OnDestroy {

  boards = [];
  alive = true;
  isLoading = true;
  boardSearchQuery = '';
  reportSheetLink = ENV.reportSheetLink;

  loadingAnimOptions: AnimationOptions = {
    path: '/assets/lib/loading-spinner.json',
    loop: true,
    autoplay: true
  };

  constructor(private router: Router,
              private boardService: BoardService,
              private alertService: AlertService ) { }

  ngOnInit() {

    this.isLoading = true;

    this.boardService.getAllBoards()
        .pipe(takeWhile(this.isAlive))
        .subscribe(
      response => {

        if (response.success && response.data) {

          this.boards = response.data;

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

  isAlive = () => {

    return this.alive;

  }

  removeBoard(board) {

    const confirmed = confirm('Are you sure you want to remove?');

    if (!confirmed || !board) {

      return;

    }

    const boardToRemove = prompt('Enter name of board to remove');

    if (boardToRemove !== board.title) {

      return;

    }

    this.isLoading = true;

    this.boardService.deleteBoard(board._id)
        .pipe(takeWhile(this.isAlive))
        .subscribe(
      response => {

        if (response.success && response.message && response.data) {

         this.boards.forEach((brd, index) => {

           if (brd._id === board._id) {

              this.boards.splice(index, 1);

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

  ngOnDestroy() {

    this.alive = false;

  }

}
