import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Login } from 'src/app/pages/login/component/login';
import { LoginService } from 'src/app/pages/login/login.service';
import { Permission, PermissionData, UserData, Users } from 'src/app/pages/users/users';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';
import { PermissionsService } from './permissions.service';
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
allPermissions:PermissionData[]
permissionsSubject = new BehaviorSubject<PermissionData[]>([]);
permissionSubject = new BehaviorSubject<Permission>({
  Templates:true,
  Bots:true,
  Devices:true,
  Contacts:true
    });
userData$:Observable<any>;
constructor(private loginService:LoginService,private http:HttpClient,private permissionService:PermissionsService) {
  this.userInfo= this.getUserInfo();
console.log("refresh token",this.userInfo.refreshToken)
 }
 updateUserPermisisons(permissions){
  this.allPermissions=permissions

}
updatePermissions(permisions:any){
  this.userPermissions=permisions
}
async getPermission() {
  return new Promise<void>((resolve) => {
    this.getUserDataObservable().subscribe((permissions) => {
      this.updateUserPermisisons(permissions)
      this.userPermissions = this.permissionService.executePermissions(permissions);
      resolve();
    });
  });
}
async hasPermission(routeName: string) {
  // this.permissions=this.permissionService.executePermissions(permissions);
  // this.authService.updatePermissions(this.permissions)
  await this.getPermission();
  const customerId = localStorage.getItem("customerId");

  if (customerId !== "" && this.userPermissions) {
    if(routeName){

        return  routeName =="Users"? false :this.userPermissions[routeName]

      }
      else{
        return true;

      }
  } else {
    return true;
  }
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
  localStorage.setItem("apiToken",data.apiToken)
  localStorage.setItem("maskType",data.maskType)
  localStorage.setItem("phoneNumber",data.phoneNumber)
  localStorage.setItem("timeZone",data.timeZone)



}
updateUserInfo(){
  this.userInfo= this.getUserInfo();
  console.log("updated user info",this.userInfo)

}

devicesPermissions(permissions:PermissionData[],name:string){
  let modulePermissions=permissions.filter((permission)=>permission.name.split("_")[0]==name)
  return modulePermissions
  }


  getDevices(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<DeviceData[]>{
    return this.http.get<DeviceData[]>(`${env.api}Device/listDevices?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
  }
  editProfile(data):Observable<any>{
    return this.http.put<any>(`${env.api}Auth/editProfile`,data)
  }
setUserDataObservable(observable:Observable<Users>):any{
  this.userData$=observable.pipe(
    map(res=>res.permissions)

  )
}
getUserDataObservable(){
return this.userData$
}
  }
