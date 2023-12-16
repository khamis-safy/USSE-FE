import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { CheckCon, DeviceData, Init } from './device';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionData } from '../users/users';
import { PermissionsService } from 'src/app/shared/services/permissions.service';
import { environment } from 'src/environments/environment';

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
  private api: string = environment.api;

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
  return this.http.get<DeviceData[]>(`${this.api}Device/listDevices?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}

initWhatsAppB(sessionName:string,port:number,serverId:number,host?:string):Observable<Init>{
  const query=sessionName && !host?
   `?email=${this.email}&sessionName=${sessionName}&port=${port}&serverId=${serverId}`
   :sessionName && host?
   `?email=${this.email}&sessionName=${sessionName}&port=${port}&host=${host}`
   :`?email=${this.email}`

  return this.http.post<Init>(`${this.api}Device/InitializeWhatsappBisunessSession${query}`,"")
}

CheckWhatsappBisuness(sessionName:string,token:string,port:number,serverId:number):Observable<CheckCon>{
  const data={
    sessionName:sessionName,
    token:token,
    port:port,
    serverId: serverId
  }
  return this.http.post<CheckCon>(`${this.api}Device/CheckWhatsappBisunessSession`,data)

}
getDevicesCount(email:string):Observable<number>{
  return this.http.get<number>(`${this.api}Device/listDevicesCount?email=${email}`)
}

deleteDevice(email:string,id:string):Observable<DeviceData>{
  return this.http.put<DeviceData>(`${this.api}Device/deleteDevice?email=${email}&id=${id}`,"")
}
reconnectWPPDevice(id:string,email:string):Observable<any>{
  return this.http.put<any>(`${this.api}Device/reconnectWBSDevice?id=${id}&email=${email}`,"")
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
  return this.http.post<any>(`${this.api}Device/addNewWhatsappBisunessDevice`,data)
}

updateDeviceDelay(email:string,id:string ,delayIntervalInSeconds:number):Observable<DeviceData>{
  return this.http.put<DeviceData>(`${this.api}Device/updateDeviceDelay?email=${email}&id=${id}&delay=${delayIntervalInSeconds}`,"")
}
extractChats(email: string, deviceId: string): Observable<any> {
  const url = `${this.api}Device/extractChats?email=${email}&deviceId=${deviceId}`;
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  return this.http.get(url, {
    headers: headers,
    responseType: 'blob', // Set the responseType to 'blob'
  });
}
}
