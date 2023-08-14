import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CompaignsDetailsService {

  constructor(private http:HttpClient) {

  }

}
