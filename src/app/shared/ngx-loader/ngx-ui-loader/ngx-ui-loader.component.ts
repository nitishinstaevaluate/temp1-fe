import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Loader, NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

@Component({
  selector: 'app-ngx-ui-loader',
  templateUrl: './ngx-ui-loader.component.html',
  styleUrls: ['./ngx-ui-loader.component.scss']
})
export class NgxUiLoaderComponent implements OnInit{
  @Input() loader:any
  constructor(private ngxUiLoaderService:NgxUiLoaderService){}

  ngOnInit() {
    if (this.loader === 'reviewForm') {
      this.ngxUiLoaderService.stop();
      this.loader = this.ngxUiLoaderService.getLoader('reviewForm');
      this.ngxUiLoaderService.start('reviewForm');
    } else if (this.loader === 'mainForm') {
      this.ngxUiLoaderService.stop();
      this.loader = this.ngxUiLoaderService.getLoader('mainForm');
      this.ngxUiLoaderService.start('mainForm');
    } else if (this.loader === 'reportForm') {
      this.ngxUiLoaderService.stop();
      this.loader = this.ngxUiLoaderService.getLoader('reportForm');
      this.ngxUiLoaderService.start('reportForm');
    }
    else if(this.loader === 'activityTab') {
      this.ngxUiLoaderService.stop();
      this.loader = this.ngxUiLoaderService.getLoader('activityTab');
      this.ngxUiLoaderService.start('activityTab');
    }
  }
}
