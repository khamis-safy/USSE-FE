import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { CheckCon, Device } from './device';
@Injectable({
  providedIn: 'root'
})
export class DevicesService {

constructor(private http:HttpClient) { }

initWhatsAppB(sessionName:string):Observable<Device>{
  return this.http.post<Device>(`${env.api}Device/InitializeWhatsappBisunessSession?sessionName=${sessionName}`,"")
}

CheckWhatsappBisuness(sessionName:string,token:string):Observable<CheckCon>{
  const data={
    sessionName:sessionName,
    token:token
  }
  return this.http.post<CheckCon>(`${env.api}Device/CheckWhatsappBisunessSession`,data)
}
}
