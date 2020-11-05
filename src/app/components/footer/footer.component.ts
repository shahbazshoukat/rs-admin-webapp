import { Component, OnInit } from '@angular/core';
import { environment as ENV } from '@env/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();

  constructor() { }

  ngOnInit() {
  }

  openFbPage() {

    window.open(ENV.fbPageUrl, '_blank');

  }

}
