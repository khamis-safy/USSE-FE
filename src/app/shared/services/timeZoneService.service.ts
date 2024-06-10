import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeZoneServiceService {

constructor(    private datePipe: DatePipe,
) {

 }
private timezoneSubject = new BehaviorSubject<number>(0); // Default to UTC
timezone$: Observable<number> = this.timezoneSubject.asObservable().pipe(shareReplay());

setTimezone(timezone: number) {
  this.timezoneSubject.next(timezone);
}

getTimezone(): number {
  return this.timezoneSubject.value;
}


// Method to convert the current UTC time to a specific timezone offset
getCurrentTime(timezoneOffset): Date {
 // Get current UTC time
    // const now: Date = new Date();
    // const utcOffset: number = now.getTimezoneOffset() / 60; // Get UTC offset in hours
    // const localTime: number = now.getTime() + (utcOffset * 3600 * 1000); // Convert to local time
    // const targetTime: number = localTime + (timezone * 3600 * 1000); // Apply timezone offset
    // return new Date(targetTime);

    const timezoneValue = timezoneOffset;
    const sign = timezoneValue >= 0 ? '+' : '-';
    const timezone = `UTC${sign}${Math.abs(timezoneValue)}`;
  return new Date(this.datePipe.transform(new Date(),`yyyy-MM-ddTHH:mm:ss`, timezone))
}
}
