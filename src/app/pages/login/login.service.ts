import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // refreshToken(refreshToken:string):Observable<Login>{
  //   const headers = new HttpHeaders({
  //           'Authorization': `Bearer ${refreshToken}`
  //         });
  //   return this.http.get<Login>(`${env.api}Auth/refreshToken`, { headers })
  // }



  private getCookieValue(cookieName: string): string {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        console.log("cookie valu",decodeURIComponent(value))
        return decodeURIComponent(value);
      }
    }
    return '';
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getCookieValue('refreshToken');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${refreshToken}`
      });

      return this.http.get<any>(`${env.api}Auth/refreshToken`, { headers })
  }


  sendEmailCode(email:string):Observable<any>{

    return this.http.post<any>(`${env.api}Auth/sendEmailCode?email=${email}`,"")
  }
}
