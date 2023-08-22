import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Login } from './component/login';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
// Mm123456@@
  constructor(private http:HttpClient) { }
  login(data):Observable<Login>{

    return this.http.post<Login>(`${env.api}Auth/login`,data)
  }

  refreshToken():Observable<Login>{

    return this.http.get<Login>(`${env.api}Auth/refreshToken`)
  }
  sendEmailCode(email:string):Observable<any>{

    return this.http.post<any>(`${env.api}Auth/sendEmailCode?email=${email}`,"")
  }
}
