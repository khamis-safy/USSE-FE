import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable, shareReplay } from 'rxjs';
import { ChatById, Chats } from './interfaces/Chats';


@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private api: string = `${environment.api}Chat`;
constructor(private http:HttpClient) { }

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
}
