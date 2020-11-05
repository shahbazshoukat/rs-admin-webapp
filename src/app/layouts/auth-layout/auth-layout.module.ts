import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from '@app/layouts/auth-layout/auth-layout.routing';

import {
  LoginComponent,
  RegisterComponent
} from '@app/pages/admin';

import { AlertModule, AlertService } from 'ngx-alerts';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
export function playerFactory() {
  return player;
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    LottieModule.forRoot({ player: playerFactory, useCache: true }),
    AlertModule.forRoot({maxMessages: 5, timeout: 3000, position: 'right'})
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    AlertService
  ]
})
export class AuthLayoutModule { }
