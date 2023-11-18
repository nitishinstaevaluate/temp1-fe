import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringModificationPipe'
})
export class StringModificationPipe implements PipeTransform {

  transform(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
      return value;
    } else {
      return value.substring(0, maxLength) + '...';
    }
  }

}
