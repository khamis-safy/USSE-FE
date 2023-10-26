import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { CheckCon, DeviceData, Init } from './device';
import { ErrSucc } from '../manage-contacts/list-data';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionData } from '../users/users';
import { PermissionsService } from 'src/app/shared/services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  display:number=10;
  pageNum:number=0;
  email:string=this.authService.getUserInfo()?.email;
  orderedBy:string="";
  search:string="";
  DevicesPermission:PermissionData;

constructor(private http:HttpClient,
  private authService:AuthService,
  private permissionService:PermissionsService) {
  if(authService.userInfo?.customerId!=""){
    authService.getUserDataObservable().subscribe(permissions => {
      this.DevicesPermission=permissions.find((e)=>e.name=="Devices");
    })
   }
   else{
     this.DevicesPermission={name:"Devices",value:"FullAccess"}
   }
}
getDevices(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<DeviceData[]>{
  return this.http.get<DeviceData[]>(`${env.api}Device/listDevices?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}

initWhatsAppB(sessionName:string,port:number,serverId:number,host?:string):Observable<Init>{
  const query=sessionName && !host?
   `?email=${this.email}&sessionName=${sessionName}&port=${port}&serverId=${serverId}`
   :sessionName && host?
   `?email=${this.email}&sessionName=${sessionName}&port=${port}&host=${host}`
   :`?email=${this.email}`

  return this.http.post<Init>(`${env.api}Device/InitializeWhatsappBisunessSession${query}`,"")
}

CheckWhatsappBisuness(sessionName:string,token:string,port:number,serverId:number):Observable<CheckCon>{
  const data={
    sessionName:sessionName,
    token:token,
    port:port,
    serverId: serverId
  }
  return this.http.post<CheckCon>(`${env.api}Device/CheckWhatsappBisunessSession`,data)

}
getDevicesCount(email:string):Observable<number>{
  return this.http.get<number>(`${env.api}Device/listDevicesCount?email=${email}`)
}

deleteDevice(email:string,id:string):Observable<DeviceData>{
  return this.http.put<DeviceData>(`${env.api}Device/deleteDevice?email=${email}&id=${id}`,"")
}
reconnectWPPDevice(id:string,email:string):Observable<any>{
  return this.http.put<any>(`${env.api}Device/reconnectWBSDevice?id=${id}&email=${email}`,"")
}

addNewWhatsappBisunessDevice( email: string,deviceName: string,phoneNumber: string,token: string,sessionName: string,port:number,serverId:number):Observable<any>{
  const data={
    email: email,
    deviceName: deviceName,
    phoneNumber: phoneNumber,
    token: token,
    sessionName: sessionName,
    port:port,
    serverId: serverId
  }
  return this.http.post<any>(`${env.api}Device/addNewWhatsappBisunessDevice`,data)
}

updateDeviceDelay(email:string,id:string ,delayIntervalInSeconds:number):Observable<DeviceData>{
  return this.http.put<DeviceData>(`${env.api}Device/updateDeviceDelay?email=${email}&id=${id}&delay=${delayIntervalInSeconds}`,"")
}
}
