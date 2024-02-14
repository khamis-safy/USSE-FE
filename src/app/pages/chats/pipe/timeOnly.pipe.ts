import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeOnly'
})
export class TimeOnlyPipe implements PipeTransform {

  transform(utcDate: string): any {
    if (utcDate) {
      utcDate = utcDate.indexOf('Z') > -1 ? utcDate : (utcDate + 'Z');
      const localDate = new Date(utcDate);

      const day = localDate.getDate();
      const month = localDate.getMonth() + 1; // Months are 0-indexed, so add 1
      const year = localDate.getFullYear();
      let hour = localDate.getHours();
      let minute = localDate.getMinutes();

      // Convert hours to 12-hour format and determine AM/PM
      const amPm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12; // Handle 0 as 12 for 12-hour format

      // Add leading '0' if the hour is less than 10
      const formattedHour = hour < 10 ? '0' + hour : hour;

      // Add leading '0' if the minute is less than 10
      const formattedMinute = minute < 10 ? '0' + minute : minute;

      // Create a formatted date string
      const formatedTime = `${formattedHour}:${formattedMinute} ${amPm}`;

      return formatedTime;
  }
  }

}
