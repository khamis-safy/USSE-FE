import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLocalTime'
})
export class ToLocalTimePipe implements PipeTransform {

  transform(utcDate: string): any {
    if(utcDate){
      utcDate = utcDate.indexOf('Z') > -1 ? utcDate : (utcDate + 'Z')
      return new Date(new Date(utcDate).toLocaleString());
    }
  }

}
