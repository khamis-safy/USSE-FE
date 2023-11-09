import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
@Injectable({
    providedIn: 'root'
  })
@Injectable()
export class CountryService {

    constructor(private http: HttpClient) {
      
    }
    getCountryCode(): Observable<any> {
      return this.http.get('https://ipapi.co/json/').pipe(map((response: any) => response.country_calling_code));
    }
  
    
}
