import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject, shareReplay } from 'rxjs';
import { ChatById, Chats } from './interfaces/Chats';
import * as signalR from "@microsoft/signalr";


@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private api: string = `${environment.api}Chat`;
  private signalRlink = `${environment.signalR}`
  private hubConnection: signalR.HubConnection;
  receivedMessages$=new BehaviorSubject<any>([]);
  updatedStatus$ = new BehaviorSubject<any>([]);

constructor(private http:HttpClient) { 
 

}
startConnection(){
  this.createConnection();
  this.onReceiveMessage();
  this.onStatusChange();

}
private createConnection() {
  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.signalRlink) // Specify the URL of your SignalR hub
    .build();
    this.startHubConnection()

}

private startHubConnection (): void {
  this.hubConnection
    .start()
    .then(() => console.log('Connection started'))
    .catch(err => console.log('Error while starting connection: ' + err));
}
public onReceiveMessage = ()=>{
  this.hubConnection.on('ReceiveMessage',(email,message)=>{
    this.receivedMessages$.next({userEmail:email,message:message});
    console.log('onReciveWorks',{userEmail:email,message:message})

  })
}
public onStatusChange = ()=>{
  this.hubConnection.on('StatusUpdate',(email,message)=>{
    this.updatedStatus$.next({userEmail:email,message:message});
    console.log('StatusUpdate',{userEmail:email,message:message})

  })
}
closeConnection(){
  this.hubConnection.stop();
}
listChats(email:string,showsNum:number,pageNum:number,search:string,deviceId:string):Observable<Chats[]>{
  return this.http.get<Chats[]>(`${this.api}/listChats?email=${email}&take=${showsNum}&scroll=${pageNum}&search=${search}&deviceId=${deviceId}`)
}
deleteChat(id:string , email:string):Observable<any>{
  return this.http.put<any>(`${this.api}/deleteChat?email=${email}&id=${id}`,null)
}
updateChat(chat):Observable<any>{
  return this.http.put<any>(`${this.api}/updateChat`,chat)
}
addNewChat(chat):Observable<any>{
  return this.http.post<any>(`${this.api}/addNewChat`,chat)
}
getChatById(email:string,chatId:string,showsNum:number,pageNum:number,search:string,deviceId:string):Observable<ChatById[]>{
  return this.http.get<ChatById[]>(`${this.api}/getChatById?email=${email}&take=${showsNum}&scroll=${pageNum}&search=${search}&deviceId=${deviceId}&chatId=${chatId}`).pipe(
    shareReplay()
    )
}
markChatAsRead(chatId:string):Observable<any>{
  return this.http.put<any>(`${this.api}/markChatAsRead?id=${chatId}`,null)
}
}
