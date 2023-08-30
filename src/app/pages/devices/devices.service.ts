import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { CheckCon, DeviceData, Init } from './device';
import { ErrSucc } from '../manage-contacts/list-data';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionData } from '../users/users';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  display:number=10;
  pageNum:number=0;
  email:string=this.authService.userInfo.email;
  orderedBy:string="";
  search:string="";
  DevicesPermission:PermissionData;

constructor(private http:HttpClient,private authService:AuthService) {
  if(authService.userInfo.customerId!=""){
    authService.getPermissionsObservable().subscribe(permissions => {
      this.DevicesPermission=permissions.find((e)=>e.name=="Devices");
      if(!this.DevicesPermission){
        this.DevicesPermission={name:"Devices",value:"ReadOnly"}
      }
      console.log(this.DevicesPermission)

      // Update your sidebar links based on the updated permissions
    });
   }
   else{
     this.DevicesPermission={name:"Devices",value:"FullAccess"}
     console.log(this.DevicesPermission)
   }
}
getDevices(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<DeviceData[]>{
  return this.http.get<DeviceData[]>(`${env.api}Device/listDevices?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}

initWhatsAppB(sessionName:string):Observable<Init>{
  return this.http.post<Init>(`${env.api}Device/InitializeWhatsappBisunessSession?sessionName=${sessionName}`,"")
}

CheckWhatsappBisuness(sessionName:string,token:string):Observable<CheckCon>{
  const data={
    sessionName:sessionName,
    token:token
  }
  return this.http.post<CheckCon>(`${env.api}Device/CheckWhatsappBisunessSession`,data)

}
getDevicesCount(email:string):Observable<number>{
  return this.http.get<number>(`${env.api}Device/listDevicesCount?email=${email}`)
}

deleteDevice(email:string,id:string):Observable<DeviceData>{
  return this.http.put<DeviceData>(`${env.api}Device/deleteDevice?email=${email}&id=${id}`,"")
}
reconnectWPPDevice(email:string,id:string):Observable<any>{
  return this.http.put<any>(`${env.api}Device/reconnectWPPDevice?email=${email}&id=${id}`,"")
}

addNewWhatsappBisunessDevice( email: string,deviceName: string,phoneNumber: string,token: string,sessionName: string):Observable<any>{
  const data={
    email: email,
    deviceName: deviceName,
    phoneNumber: phoneNumber,
    token: token,
    sessionName: sessionName
  }
  return this.http.post<any>(`${env.api}Device/addNewWhatsappBisunessDevice`,data)
}

updateDeviceDelay(email:string,id:string ,delayIntervalInSeconds:number):Observable<DeviceData>{
  return this.http.put<DeviceData>(`${env.api}Device/updateDeviceDelay?email=${email}&id=${id}&delay=${delayIntervalInSeconds}`,"")
}
}
