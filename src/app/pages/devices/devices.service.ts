import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { CheckCon, DeviceData, Init } from './device';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  display:number=10;
  pageNum:number=0;
  email:string="khamis.safy@gmail.com";
  orderedBy:string="";
  search:string="";
constructor(private http:HttpClient) { }
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

deletDevice(email:string,id:string):Observable<any>{
  return this.http.put<any>(`${env.api}Device/deleteWPPDevice?email=${email}&id=${id}`,"")
}
econnectWPPDevice(email:string,id:string):Observable<any>{
  return this.http.put<any>(`${env.api}Device/deleteWPPDevice?email=${email}&id=${id}`,"")
}
}
