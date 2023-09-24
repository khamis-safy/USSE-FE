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

// khamissafy056@gmail.com
// Khamis.Safy@056
userInfo!:any;
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
updateUser(userinfo){
  this.userInfo=userinfo
}
  storeRefreshTokenInCookie(token: string) {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1); // Cookie will expire in 1 hour

    const encodedToken = encodeURIComponent(token); // Encode the token
    const cookieValue = `refreshToken=${encodedToken}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  }

  public getCookieValue(cookieName: string): string {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, encodedValue] = cookie.trim().split('=');
      if (name === cookieName) {
        const decodedValue = decodeURIComponent(encodedValue); // Decode the value
        return decodedValue;
      }
    }
    return null;
  }

  refreshToken(token:string): Observable<any> {
    const refreshToken ={
      token:token
    };

    return this.http.post<any>(`${env.api}Auth/refreshToken`, refreshToken)
  }


  sendEmailCode(email:string):Observable<any>{

    return this.http.post<any>(`${env.api}Auth/sendEmailCode?email=${email}`,"")
  }
}
