import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
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
      this.setCountryBasedOnIP().subscribe(
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
