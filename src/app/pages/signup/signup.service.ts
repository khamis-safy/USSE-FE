import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment as env} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

constructor(private http:HttpClient) { }
  register(val:any){
    return this.http.post(`${env.domain}Auth/register`,val)
  }
}
