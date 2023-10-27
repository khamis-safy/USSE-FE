import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Login } from 'src/app/pages/login/component/login';
import { LoginService } from 'src/app/pages/login/login.service';
import { Permission, PermissionData, UserData, Users } from 'src/app/pages/users/users';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';
import { PermissionsService } from './permissions.service';
import { PluginsService } from 'src/app/services/plugins.service';
import { LocalStorageService } from './localStorage.service';
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
  selectedDeviceId:string="";
  code!:string;
  email:string;
  from!:string;
  accessToResetPass!:boolean;
  RoleAndRefreshtoken:any;
  userData!:UserData;
  resfreshToken!:string;
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
constructor(private loginService:LoginService,
  private http:HttpClient,
  private permissionService:PermissionsService,
  private localStorageService: LocalStorageService,
  private plugin:PluginsService
  ) {
    this.setRefreshToken();
    // this.getUserInfoFromRequest();
 }

 loadUserInfo(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (this.userInfo) {
      resolve(this.userInfo);
    } else if (this.checkExistenceAndValidation()) {
      const decryptedEmail = this.localStorageService.getDecryptedData('email');
      this.permissionService.getUserByEmail(decryptedEmail).subscribe(
        (res) => {
          const data={
            userName:res.contactName,
            organisationName:res.organisationName,
            id:res.id,
            email:res.email,
            token:res.token,
            customerId:res.customerId,
            apiToken:res.apiToken,
            maskType:res.maskType,
            phoneNumber:res.phoneNumber,
            timezone:res.timezone,
            
          }
          this.updateUserInfo(data);
          resolve(this.userInfo);
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject('User information not available');
    }
  });
}

//  getUserInfoFromRequest(){
//   if(this.checkExistenceAndValidation()){
//     const decryptedEmail = this.localStorageService.getDecryptedData("email")
//     this.permissionService.getUserByEmail(decryptedEmail).subscribe(
//       (res)=>{
//         const data={
//           userName:res.contactName,
//           organisationName:res.organisationName,
//           id:res.id,
//           email:res.email,
//           token:res.token,
//           customerId:res.customerId,
//           apiToken:res.apiToken,
//           maskType:res.maskType,
//           phoneNumber:res.phoneNumber,
//           timezone:res.timezone,
//           roles:res.roles[0],
//           refreshToken:res.refreshTokens[0].token
//         }
//         this.updateUserInfo(data)
//       }
//     )
//   }
//  }

 getUserInfo(){
  return this.userInfo
 }
 updateUserInfo(data?){
  this.userInfo=data
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
  const customerId = this.userInfo.customerId;
  if (customerId !== "" ){

    await this.getPermission();
    if (customerId !== "" && this.userPermissions) {
      if(routeName){

          return  routeName =="Users"? false :this.userPermissions[routeName]

        }
        else{
          return true;

        }
    }
    else {
      return true;
    }
  }

  else {
    return true;
  }
}

// help to acces to reset passward page from
setAccessToReset(access){
  this.accessToResetPass=access
  }

getAccessToReset(){
  return this.accessToResetPass
  }
// help to get code from verification page to reset passward page
setCode(code){
  this.code=code
}
getCode(){
  return this.code
}
// get email after login or signup to be used in verification page 
setEmail(email){
this.email=email
}
getEmail(){
return this.email
}

// from variable used verification page to detect which funcion will be used (is it from login or forgot passward or signup)
setFromValue(from){
  this.from=from
}
getFromValue(){
  return this.from
}

setRoleAndRefreshtoken(role,refreshToken){
this.RoleAndRefreshtoken={

}
}

setUserDataObservable(observable:Observable<Users>):any{
  this.userData$=observable.pipe(
    map(res=>res.permissions)

  )
}
getUserDataObservable(){
  return this.userData$
  }


isLoggedIn(){

return this.checkExistenceAndValidation()

}

saveDataToLocalStorage(data){
  // encrypt email and save to local storage 

  localStorage.setItem("token",data.token)
  this.localStorageService.saveEncryptedData("email", data.email);
  localStorage.setItem("role",data.roles)

  // this.loginService.storeRefreshTokenInCookie(data.refreshToken);




}

 
 
 checkExistenceAndValidation(){
  if(localStorage.getItem("token") && this.loginService.getCookieValue("refreshToken") && localStorage.getItem("email")){
    const decryptedEmail = this.localStorageService.getDecryptedData("email");
    return this.isEmailValid(decryptedEmail)
  }
  else{
    return false
  }
}
isEmailValid(email:string){
  return this.plugin.emailReg.test(email)
}

clearUserInfo(){
  let localData=['email',"token"]
  localData.map((key)=>localStorage.removeItem(key));
  this.loginService.removeCookie("refreshToken")

}
// setting user data from login or signup components
setUserData(userData:any,token:any){
  this.userData=userData;
  this.resfreshToken=token;
  }
// get user data
getUserData(){
  return this.userData
}
setRefreshToken(){
  if(this.loginService.getCookieValue("refreshToken")){

    this.resfreshToken=this.loginService.getCookieValue("refreshToken")
  }

}
getRefreshToken(){
  return this.resfreshToken

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

 getBackEndVersion()
 :Observable<string>{
  return this.http.get<string>(`${env.api}Auth/getVersion`)
}

  }
