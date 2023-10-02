import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifyService {

  constructor(private http:HttpClient) { }

  // confirmEmail(code:string,token:string):Observable<any>{
  //   const refreshToken = localStorage.getItem("token")
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${refreshToken}`
  //   });

  //   return this.http.put(`${env.api}Auth/confirmEmail?code=${code}&token=${token}`,"",{headers})
  // }
  confirmEmail(code:string,token:string):Observable<any>{
    const data={
      token:token
    }
    return this.http.put(`${env.api}Auth/confirmEmail?code=${code}`,data)
  }
  confirmCode(code:string,email:string):Observable<any>{
  
    return this.http.put(`${env.api}Auth/confirmCode?code=${code}&email=${email}`,null)
  }
}
