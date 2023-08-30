import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from 'src/app/pages/login/component/login';
import { LoginService } from 'src/app/pages/login/login.service';
import { Permission, UserData } from 'src/app/pages/users/users';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
userInfo!:UserData;
unAuthorized:boolean=false;
empty:number=0;
// permissionsSubject:BehaviorSubject<Permission>;

constructor(private loginService:LoginService) {
  this.userInfo= this.getUserInfo();
  // this.getUserPermisisons(this.userInfo.email)
console.log("refresh token",this.userInfo.refreshToken)
 }
isLoggedIn(){
  this.userInfo= this.getUserInfo();
return !this.checkData(this.userInfo)

}
checkData(obj: any) {
  this.unAuthorized = false; // Reset the flag for each call

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value==null) {
        this.unAuthorized = true;
        console.log("Unauthorized", key, "is missing");
        break; // Exit the loop as soon as an empty value is detected
      }
    }
  }

  console.log("Unauthorized", this.unAuthorized);

  return this.unAuthorized;
}

saveDataToLocalStorage(data){
  localStorage.setItem('email',data.email);
  localStorage.setItem('organizationName',data.organizationName);
  localStorage.setItem('id',data.id);
  localStorage.setItem('userName',data.userName);
  localStorage.setItem("token",data.token),
  localStorage.setItem("customerId",data.customerId)

}
updateUserInfo(){
  this.userInfo= this.getUserInfo();
  console.log("updated user info",this.userInfo)

}
getUserInfo(){
 let userData$={
    userName:localStorage.getItem('userName'),
    organizationName:localStorage.getItem('organizationName'),
    id:localStorage.getItem('id'),
    email:localStorage.getItem('email'),
    customerId:localStorage.getItem("customerId"),
    refreshToken:this.loginService.getCookieValue("refreshToken")
  }
return userData$;
}
// getUserPermisisons(email){
//   let test=[
//     {name:'Messages',
//   value:'ReadOnly'},
//   {name:'Templates',
//   value:'ReadOnly'},
//   {name:'Devices',
//   value:'ReadOnly'}
//   ]
//   this.permissionsSubject.next(this.userServiece.executePermissions(test));

//   this.userServiece.getUserByEmail("user1@gmail.com").subscribe(
//     (res)=>{
//       this.permissionsSubject.next(this.userServiece.executePermissions(res.permissions));
//       console.log(this.permissionsSubject)
//     },
//     (err)=>{}
//   )

// }
// getPermissionsObservable(): Observable<Permission> {
//   return this.permissionsSubject.asObservable();
// }
}
