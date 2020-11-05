import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafePipe, SearchPipe } from '@app/pipes';
import { AdminLayoutRoutes } from '@app/layouts/admin-layout/admin-layout.routing';

import {
  DashboardComponent,
  AddResultComponent,
  AddBoardComponent,
  AddClassComponent,
  ResultsComponent,
  BoardsComponent,
  ClassesComponent,
  CommentsComponent,
  NewsComponent,
  AddNewsComponent
} from '@app/pages/admin';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AlertModule, AlertService } from 'ngx-alerts';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
export function playerFactory() {
  return player;
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    LottieModule.forRoot({player: playerFactory, useCache: true}),
    AlertModule.forRoot({maxMessages: 5, timeout: 3000, position: 'right'})
  ],
  declarations: [
    DashboardComponent,
    AddResultComponent,
    AddBoardComponent,
    AddClassComponent,
    ResultsComponent,
    BoardsComponent,
    ClassesComponent,
    CommentsComponent,
    NewsComponent,
    AddNewsComponent,
      SafePipe,
      SearchPipe
  ],
  providers: [
    AlertService
  ]
})

export class AdminLayoutModule {}
