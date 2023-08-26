import { Injectable } from '@angular/core';
import { Login } from 'src/app/pages/login/component/login';
import { LoginService } from 'src/app/pages/login/login.service';
import { UserData } from 'src/app/pages/users/users';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

constructor(private loginService:LoginService) {

 }
isLoggedIn(){

  return this.userInfo()? true:false;
}
saveDataToLocalStorage(data){
  localStorage.setItem('email',data.email);
  localStorage.setItem('organizationName',data.organizationName);
  localStorage.setItem('id',data.id);
  localStorage.setItem('userName',data.userName);

}
userInfo():UserData{
 let userData$={
    userName:localStorage.getItem('userName'),
    organizationName:localStorage.getItem('organizationName'),
    id:localStorage.getItem('id'),
    email:localStorage.getItem('email'),
    refreshToken:this.loginService.getCookieValue("refreshToken")
  }
return userData$;
}
}
