import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLocalTime'
})
export class ToLocalTimePipe implements PipeTransform {

  transform(utcDate: string): any {
    if (utcDate) {
      utcDate = utcDate.indexOf('Z') > -1 ? utcDate : (utcDate + 'Z');
      const localDate = new Date(utcDate);
      
      const day = localDate.getDate();
      const month = localDate.getMonth() + 1; // Months are 0-indexed, so add 1
      const year = localDate.getFullYear();
      const hour = localDate.getHours();
      const minute = localDate.getMinutes();
  
      // Create a formatted date string
      const formattedDate = `${day}/${month}/${year}, ${hour}:${minute}`;
  
      return formattedDate;
    }
  }

}
