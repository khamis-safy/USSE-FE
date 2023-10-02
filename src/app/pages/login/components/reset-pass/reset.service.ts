import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPassService {

  constructor(private http:HttpClient) { }
  changePassword(email:string, code:string, newPassword:string):Observable<any>{
    return this.http.put<any>(`${env.api}Auth/changePassword?email=${email}&code=${code}&newPassword=${newPassword}`,null)
  }

}