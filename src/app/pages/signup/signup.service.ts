import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Login } from '../login/component/login';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

constructor(private http:HttpClient) { }

  register(data):Observable<Login>{

    return this.http.post<Login>(`${env.api}Auth/register`,data)
  }

}
