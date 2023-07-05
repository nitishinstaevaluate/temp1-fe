import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Options,LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-relative',
  templateUrl: './relative.component.html',
  styleUrls: ['./relative.component.scss']
})
export class RelativeComponent {
  constructor(public modal: NgbActiveModal) { }
  companySize: number = 100;
  revenueTurnover: number = 100;
  options: Options = {
    floor: 0,
    step: 50,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      switch (value) {
        case  0:
          return 'Small';
        case 50:
          return'Medium';
        case 100:
          return'High';
        default:
          return'Small';
      }
    }
  };
  option: Options = {
    floor: 0,
    step: 50,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      switch (value) {
        case  0:
          return '<1cr';
        case 50:
          return'1 - 10cr';
        case 100:
          return'>10cr';
        default:
          return'Small';
      }
    }
  };
  save(){

  }
}