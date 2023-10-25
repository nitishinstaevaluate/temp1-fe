import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: any): any {
    const datePipe = new Date(value);
    return [ `${datePipe.getDate()}`.substr(-2),`${datePipe.getMonth()+1}`.substr(-2), `${datePipe.getFullYear()}`].join("-")
  }

}
