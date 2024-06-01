import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, retry } from 'rxjs';
@Injectable({
    providedIn: 'root'
  })
@Injectable()
export class CountryService {
  selectedCodeISo = new BehaviorSubject('')
  constructor(private http: HttpClient) {
      this.getCountryBasedonIP();
    }
    getCountryCode(): Observable<any> {
      return this.http.get('https://ipapi.co/json/').pipe(map((response: any) => response.country_calling_code));
    }
  
    setCountryBasedOnIP(): Observable<any> {
      return this.http.get('https://ipapi.co/json/');
    }
    getCountryBasedonIP(){
      this.setCountryBasedOnIP().pipe(
        retry({
          count: 1, // Retry once
          delay: 600 // Delay of 500ms between retries
        })
      ).subscribe(
        (data) => {
          const countryName = data.country_name; // Country code from ipapi
          this.selectedCodeISo.next(countryName)
        },
        (error) => {
          console.error('IP API error:', error);
          this.selectedCodeISo.next('Egypt'); // Default to Egypt on error
        }
      )
    }
    
}
