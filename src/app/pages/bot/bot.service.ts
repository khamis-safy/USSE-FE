import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { Automation } from './interfaces/automation';


@Injectable({
  providedIn: 'root'
})
export class BotService  {
  private api: string = environment.api;

 

constructor(private http:HttpClient,
  private authService:AuthService) {}

  getAutomations(email:string,showsNum:number,pageNum:number,search:string,deviceId:string):Observable<Automation[]>{
    return this.http.get<Automation[]>(`${this.api}Bot/listAutomations?email=${email}&deviceId=${deviceId}&take=${showsNum}&scroll=${pageNum}&search=${search}`)
  }
  getAutomationsCount(email:string,deviceId:string):Observable<number>{
    return this.http.get<number>(`${this.api}Bot/listAutomationsCount?email=${email}&deviceId=${deviceId}`)
  }
  deleteAutomation(id:string,email:string):Observable<any>{
    return this.http.put<any>(`${this.api}Bot/deleteAutomation?id=${id}&email=${email}`,null)
  }
  createNewAutomation(data:any):Observable<any>{
    return this.http.post<any>(`${this.api}Bot/createNewAutomation`,data)
  }
  stopWhatsappBusinessAutomation(id:string,email:string):Observable<any>{
    return this.http.put<any>(`${this.api}Bot/stopWhatsappBusinessAutomation?id=${id}&email=${email}`,null)
  }
  startWhatsappBusinessAutomation(id:string,email:string):Observable<any>{
    return this.http.put<any>(`${this.api}Bot/startWhatsappBusinessAutomation?id=${id}&email=${email}`,null)
  }
  reOrderAutomations(email:string,deviceId:string,data:{automationId: string,order: number}[]):Observable<any>{
    return this.http.put<any>(`${this.api}Bot/reOrderAutomations?email=${email}&deviceId=${deviceId}`,data)
  }
  getAutomationById(id:string):Observable<any>{
    return this.http.get<any>(`${this.api}Bot/getAutomationById?id=${id}`)
  }
  updateAutomation(data:any):Observable<any>{
    return this.http.post<any>(`${this.api}Bot/updateAutomation`,data)
  }
}
