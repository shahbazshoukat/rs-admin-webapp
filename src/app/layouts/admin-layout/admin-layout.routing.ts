import { Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth.guard';

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

export const AdminLayoutRoutes: Routes = [
    // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'boards', component: BoardsComponent, canActivate: [AuthGuard] },
    { path: 'add-board', component: AddBoardComponent, canActivate: [AuthGuard] },
    { path: 'edit-board/:boardId', component: AddBoardComponent, canActivate: [AuthGuard] },
    { path: 'results/:boardKey', component: ResultsComponent, canActivate: [AuthGuard] },
    { path: 'add-result/:boardKey', component: AddResultComponent, canActivate: [AuthGuard] },
    { path: 'edit-result/:resultId/board/:boardKey', component: AddResultComponent, canActivate: [AuthGuard] },
    { path: 'classes', component: ClassesComponent, canActivate: [AuthGuard] },
    { path: 'add-class', component: AddClassComponent, canActivate: [AuthGuard] },
    { path: 'edit-class/:classId', component: AddClassComponent, canActivate: [AuthGuard] },
    { path: 'news', component: NewsComponent, canActivate: [AuthGuard] },
    { path: 'add-news', component: AddNewsComponent, canActivate: [AuthGuard] },
    { path: 'edit-news/:newsId', component: AddNewsComponent, canActivate: [AuthGuard] },
    { path: 'comments/board/:boardId', component: CommentsComponent, canActivate: [AuthGuard] },
    { path: 'comments/result/:resultId', component: CommentsComponent, canActivate: [AuthGuard] }
];
