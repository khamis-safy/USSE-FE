import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from 'src/app/pages/login/component/login';
import { LoginService } from 'src/app/pages/login/login.service';
import { Permission, PermissionData, UserData } from 'src/app/pages/users/users';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';
interface DeviceData {
  id: string,
  deviceName: string,
  deviceType: string,
  deviceNumber: string,
  createdAt: string,
  isConnected: boolean,
  instanceId:string,
  delayIntervalInSeconds:number,
  isDeleted: boolean,
  applicationUserId: string,
  host: string,
  password: string,
  port: string,
  systemID: string,
  lastUpdate: string,
  token: string
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
userInfo!:UserData;
unAuthorized:boolean=false;
empty:number=0;
userPermissions:Permission
usersPermissions:PermissionData[]
permissionsSubject = new BehaviorSubject<PermissionData[]>([]);

constructor(private loginService:LoginService,private http:HttpClient) {
  this.userInfo= this.getUserInfo();
console.log("refresh token",this.userInfo.refreshToken)
 }
 updateUserPermisisons(permissions){
  this.usersPermissions=permissions
  this.permissionsSubject.next(permissions);

}
getPermissionsObservable(): Observable<PermissionData[]> {
return this.permissionsSubject.asObservable();
}
isLoggedIn(){
  this.userInfo= this.getUserInfo();
return !this.checkData(this.userInfo)

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

devicesPermissions(permissions:PermissionData[],name:string){
  let modulePermissions=permissions.filter((permission)=>permission.name.split("_")[0]==name)
  return modulePermissions
  }
  hasPermission(routeName:string){
    if(this.userInfo.customerId!="" ){

     return routeName?this.userPermissions[routeName]:true

    }
  else{

    return true
  }
  }
  getDevices(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<DeviceData[]>{
    return this.http.get<DeviceData[]>(`${env.api}Device/listDevices?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
  }
  }
