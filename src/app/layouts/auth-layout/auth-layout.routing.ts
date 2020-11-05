import { Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth.guard';

import {
  LoginComponent,
  RegisterComponent
} from '@app/pages/admin';

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', canActivate: [AuthGuard] }

];
