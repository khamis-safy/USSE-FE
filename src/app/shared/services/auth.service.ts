import { Injectable } from '@angular/core';
import { Login } from 'src/app/pages/login/component/login';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData!:Login;

constructor() { }
isLoggedIn(){

  return this.userData? true:false;
}
}
