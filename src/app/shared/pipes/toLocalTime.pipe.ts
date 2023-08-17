import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLocalTime'
})
export class ToLocalTimePipe implements PipeTransform {

  transform(utcDate: any): any {
    utcDate = utcDate.includes('Z') ? utcDate : (utcDate + 'Z')
    return new Date(new Date(utcDate).toLocaleString());
  }

}
