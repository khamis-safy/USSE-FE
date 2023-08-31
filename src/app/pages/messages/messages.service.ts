import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message, Shceduled } from './message';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionData } from '../users/users';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  display:number=10;
    pageNum:number=0;
    messageasPermission:PermissionData;
    email:string=this.authService.userInfo.email;
    orderedBy:string="";
    search:string="";
    msgCategory:string="inbox";
constructor(private http:HttpClient,private authService:AuthService) {
  // if no id , it will be user account else  , it will be customer account
  if(authService.userInfo.customerId!=""){
    // if user acount check his permissions
  authService.getPermissionsObservable().subscribe(permissions => {
    this.messageasPermission=permissions.find((e)=>e.name=="Messages");
    // in case that if no permissions given to this module
    if(!this.messageasPermission){
      this.messageasPermission={name:"Messages",value:"ReadOnly"}
    }

    console.log(this.messageasPermission)

    // Update your sidebar links based on the updated permissions
  });
 }
 else{
   this.messageasPermission={name:"Messages",value:"FullAccess"}
   console.log(this.messageasPermission)
 }
}


getMessages(email:string,msgCategory:string,showsNum:number,pageNum:number,search:string,deviceId:string):Observable<Message[]>{
  return this.http.get<Message[]>(`${env.api}Message/listMessages?email=${email}&msgCategory=${msgCategory}&take=${showsNum}&scroll=${pageNum}&search=${search}&deviceId=${deviceId}`)
}
getScheduledMessages(email:string,showsNum:number,pageNum:number,deviceId:string):Observable<Shceduled[]>{
  return this.http.get<Shceduled[]>(`${env.api}Message/listScheduledMessages?email=${email}&take=${showsNum}&scroll=${pageNum}&deviceId=${deviceId}`)
}
getMessagesCount(email:string,msgCategory:string,deviceId:string):Observable<number>{
  return this.http.get<number>(`${env.api}Message/listMessagesCount?email=${email}&msgCategory=${msgCategory}&deviceId=${deviceId}`)
}
listScheduledMessagesCount(email:string,deviceId:string):Observable<number>{
  return this.http.get<number>(`${env.api}Message/listScheduledMessagesCount?email=${email}&deviceId=${deviceId}`)
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
