import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message, Shceduled } from './message';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionData } from '../users/users';
import { DevicesPermissions } from '../compaigns/compaigns.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  display:number=10;
    pageNum:number=0;
    messageasPermission:PermissionData[];
    devicesPermissions:DevicesPermissions[];
    email:string=this.authService.userInfo.email;
    orderedBy:string="";
    search:string="";
    msgCategory:string="inbox";
constructor(private http:HttpClient,private authService:AuthService) {
  if(authService.userInfo.customerId!=""){
  //   console.log("permissions from messages",authService.usersPermissions)
  //   this.messageasPermission=authService.devicesPermissions(authService.usersPermissions,"Messages");
  //   if(this.messageasPermission){
  //     this.devicesPermissions=this.messageasPermission.map((permission)=>{

  //       let name=permission.name
  //       const underscoreIndex = permission.name.indexOf("_");
  //       let deviceId=name.substring(underscoreIndex + 1)

  //       return {
  //         deviceId:deviceId,
  //         value:permission.value
  //       }
  //     })
  //     console.log(this.devicesPermissions)
  //   }

    authService.getPermissionsObservable().subscribe(permissions => {
      console.log("Messages permissions",permissions,)
      this.messageasPermission=authService.devicesPermissions(permissions,"Messages");
      if(this.messageasPermission){
        this.devicesPermissions=this.messageasPermission.map((permission)=>{

          let name=permission.name
          const underscoreIndex = permission.name.indexOf("_");
          let deviceId=name.substring(underscoreIndex + 1)

          return {
            deviceId:deviceId,
            value:permission.value
          }
        })
        console.log(this.devicesPermissions)
      }


    });
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


  return this.http.put<number>(`${env.api}Message/deleteMessage?email=${this.email}`,ids)

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
