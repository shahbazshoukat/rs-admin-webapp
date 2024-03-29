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
    AddNewsComponent,
    AddUserComponent,
    UsersComponent,
    AddDateSheetComponent,
    DateSheetsComponent,
    AddModelPaperComponent,
    ModelPapersComponent
} from '@app/pages/admin';

export const AdminLayoutRoutes: Routes = [
    // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'boards', component: BoardsComponent, canActivate: [AuthGuard] },
    { path: 'add-board', component: AddBoardComponent, canActivate: [AuthGuard] },
    { path: 'edit-board/:boardId', component: AddBoardComponent, canActivate: [AuthGuard] },

    { path: 'results/:boardKey', component: ResultsComponent, canActivate: [AuthGuard] },
    { path: 'add-result/:boardKey', component: AddResultComponent, canActivate: [AuthGuard] },
    { path: 'edit-result/:resultId/board/:boardKey', component: AddResultComponent, canActivate: [AuthGuard] },
    { path: 'copy-result/:copyResultId/board/:boardKey', component: AddResultComponent, canActivate: [AuthGuard] },

    { path: 'date-sheets/:boardKey', component: DateSheetsComponent, canActivate: [AuthGuard] },
    { path: 'add-date-sheet/:boardKey', component: AddDateSheetComponent, canActivate: [AuthGuard] },
    { path: 'edit-date-sheet/:dateSheetId/board/:boardKey', component: AddDateSheetComponent, canActivate: [AuthGuard] },
    { path: 'copy-date-sheet/:copyDateSheetId/board/:boardKey', component: AddDateSheetComponent, canActivate: [AuthGuard] },

    { path: 'model-papers/:boardKey', component: ModelPapersComponent, canActivate: [AuthGuard] },
    { path: 'add-model-paper/:boardKey', component: AddModelPaperComponent, canActivate: [AuthGuard] },
    { path: 'edit-model-paper/:modelPaperId/board/:boardKey', component: AddModelPaperComponent, canActivate: [AuthGuard] },

    { path: 'classes', component: ClassesComponent, canActivate: [AuthGuard] },
    { path: 'add-class', component: AddClassComponent, canActivate: [AuthGuard] },
    { path: 'edit-class/:classId', component: AddClassComponent, canActivate: [AuthGuard] },

    { path: 'news', component: NewsComponent, canActivate: [AuthGuard] },
    { path: 'add-news', component: AddNewsComponent, canActivate: [AuthGuard] },
    { path: 'edit-news/:newsId', component: AddNewsComponent, canActivate: [AuthGuard] },

    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard] },
    { path: 'edit-user/:userId', component: AddUserComponent, canActivate: [AuthGuard] },

    { path: 'comments/board/:boardId', component: CommentsComponent, canActivate: [AuthGuard] },
    { path: 'comments/result/:resultId', component: CommentsComponent, canActivate: [AuthGuard] },
    { path: 'comments/date-sheet/:dateSheetId', component: CommentsComponent, canActivate: [AuthGuard] }
];
