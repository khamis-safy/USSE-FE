import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { ErrSucc, ListData } from './list-data';
import { Contacts } from './contacts';

@Injectable({
  providedIn: 'root'
})
export class ManageContactsService {
    display:number=5;
    pageNum:number=0;
    email:string="khamis.safy@gmail.com";
    orderedBy:string="";
    search:string="";
  constructor(private http:HttpClient) { }

// lists methods
addList(name:string,email:string): Observable<ListData>{
    const data ={
    name:name,
    email:email
  }
  return this.http.post<ListData>(`${env.api}Contacts/addNewList`,data)
}

updateList(id:string,name:string,email:string): Observable<ListData>{
const data ={
    id:id,
    name:name,
    email:email
  }
  return this.http.put<ListData>(`${env.api}Contacts/updateList`,data)
}

deleteList(email:string,listArr:string[]): Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${env.api}Contacts/deleteList?email=${email}`,listArr)
}
getList(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<ListData[]>{
  return this.http.get<ListData[]>(`${env.api}Contacts/listLists?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}
ListsCount(email:string):Observable<number>{
  return this.http.get<number>(`${env.api}Contacts/listListsCount?email=${email}`)
}

unDeleteList(email:string,ids:string[]):Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${env.api}Contacts/unDeleteList?email=${email}`,ids)
}

// contacts methods
getContacts(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<Contacts[]>{
  return this.http.get<Contacts[]>(`${env.api}Contacts/listContacts?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}

addContact(name:string,mobileNumber:string,companyName:string,note:string,email:string,listId:string[]):Observable<Contacts>{
  const data={
    name:name,
    mobileNumber:mobileNumber,
    companyName:companyName,
    note:note,
    email: email,
    listId:listId
  }
  return this.http.post<Contacts>(`${env.api}Contacts/addNewContact`,data)
}

updateContact(id:string,name:string,mobileNumber:string,companyName:string,note:string,email:string):Observable<any>{
  const data={
    id:id,
    name: name,
    mobileNumber: mobileNumber,
    companyName: companyName,
    note: note,
    email: email

  }
  return this.http.put(`${env.api}Contacts/updateContact`,data)
}
deleteContact(email:string,listIDs:string[]): Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${env.api}Contacts/deleteContact?email=${email}`,listIDs)
}
contactsCount(email:string):Observable<number>{
  return this.http.get<number>(`${env.api}Contacts/listContactsCount?email=${email}`)
}
}
