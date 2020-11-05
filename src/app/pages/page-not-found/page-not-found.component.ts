import { Component, OnInit } from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';
import {Router} from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  pageNotFoundAnimOptions: AnimationOptions = {
    path: '/assets/lib/error.json'
  };

  pageNotFoundAnim: AnimationItem;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  pageNotFoundAnimationCreated(animationItem: AnimationItem): void {

    this.pageNotFoundAnim = animationItem;

  }

  backToHome() {

    this.router.navigate(['']);

  }

}
