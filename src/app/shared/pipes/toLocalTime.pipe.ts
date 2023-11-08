import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLocalTime'
})
export class ToLocalTimePipe implements PipeTransform {

  transform(utcDate: string): any {
    if (utcDate) {
      utcDate = utcDate.indexOf('Z') > -1 ? utcDate : (utcDate + 'Z');
      const localDate = new Date(utcDate);
      const options:any = { hour: 'numeric', minute: 'numeric', month: 'numeric', day: 'numeric', year: 'numeric' };
      return localDate.toLocaleDateString(undefined, options);
    }
  }

}
