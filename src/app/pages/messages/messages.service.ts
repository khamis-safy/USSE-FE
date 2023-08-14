import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message, Shceduled } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  display:number=10;
    pageNum:number=0;
    email:string="khamis.safy@gmail.com";
    orderedBy:string="";
    search:string="";
    msgCategory:string="inbox";
constructor(private http:HttpClient) { }

getMessages(email:string,msgCategory:string,showsNum:number,pageNum:number,search:string):Observable<Message[]>{
  return this.http.get<Message[]>(`${env.api}Message/listMessages?email=${email}&msgCategory=${msgCategory}&take=${showsNum}&scroll=${pageNum}&search=${search}`)
}
getScheduledMessages(email:string,showsNum:number,pageNum:number):Observable<Shceduled[]>{
  return this.http.get<Shceduled[]>(`${env.api}Message/listScheduledMessages?email=${email}&take=${showsNum}&scroll=${pageNum}`)
}
getMessagesCount(email:string,msgCategory:string):Observable<number>{
  return this.http.get<number>(`${env.api}Message/listMessagesCount?email=${email}&msgCategory=${msgCategory}`)
}
listScheduledMessagesCount(email:string):Observable<number>{
  return this.http.get<number>(`${env.api}Message/listScheduledMessagesCount?email=${email}`)
}
deleteMessage(ids:string[]):Observable<any>{

  return this.http.put<number>(`${env.api}Message/deleteMessage`,ids)

}

sendWhatsappBusinessMessage( deviceid: string,targetPhoneNumber: string[],msgBody: string,scheduledAt:string,email: string,attachments:string[]):Observable<any>{

  const data=attachments.length!=0?{
    deviceid: deviceid,
    targetPhoneNumber: targetPhoneNumber,
    attachments:attachments,
    msgBody: msgBody,
    scheduledAt:scheduledAt,
    email: email
  }:{
    deviceid: deviceid,
    targetPhoneNumber: targetPhoneNumber,
    msgBody: msgBody,
    scheduledAt:scheduledAt,
    email: email
  }
  return this.http.post<any>(`${env.api}Message/sendWhatsappBusinessMessage`,data)

}

}
