import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from './component/login';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
private api: string = environment.api;


userInfo:any;
  constructor(private http:HttpClient) { }
  login(data):Observable<Login>{

    return this.http.post<Login>(`${this.api}Auth/login`,data)
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
  public removeCookie(cookieName: string): void {
    const expirationDate = new Date('2000-01-01'); // Set expiration date to a past date
    const removedCookie = cookieName + '=; expires=' + expirationDate.toUTCString() + '; path=/';
    document.cookie = removedCookie;
  }
  refreshToken(token:string): Observable<any> {
    const refreshToken ={
      token:token
    };

    return this.http.post<any>(`${this.api}Auth/refreshToken`, refreshToken)
  }


  sendEmailCode(email:string):Observable<any>{

    return this.http.post<any>(`${this.api}Auth/sendEmailCode?email=${email}`,"")
  }
}
