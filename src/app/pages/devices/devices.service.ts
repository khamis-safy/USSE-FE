import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DevicesService {

constructor(private http:HttpClient) { }
initWhatsappB(sessionName:string):Observable<any>{
  return this.http.post<any>(`${env.api}Device/InitializeWhatsappBisunessSession?sessionName=${sessionName}`,"")
}
}
