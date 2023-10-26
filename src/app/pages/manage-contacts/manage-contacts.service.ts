import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { ErrSucc, ListData } from './list-data';
import { Contacts } from './contacts';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionData } from '../users/users';

@Injectable({
  providedIn: 'root'
})
export class ManageContactsService {
  listName:string="";

    display:number=10;
    pageNum:number=0;
    email:string=this.authService.getUserInfo()?.email;
    orderedBy:string="";
    search:string="";
    contactsPermissions:PermissionData;
  constructor(private http:HttpClient,private authService:AuthService) {
    if(authService.userInfo?.customerId!=""){
      authService.getUserDataObservable().subscribe(permissions => {
        this.contactsPermissions=permissions.find((e)=>e.name=="Contacts");
      })
     }
     else{
       this.contactsPermissions={name:"Contacts",value:"FullAccess"}
     }
   }

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


getListById(listId:string): Observable<ListData>{

    return this.http.get<ListData>(`${env.api}Contacts/getListById?id=${listId}`)
  }

// contacts methods
getContacts(email:string,isCanceled:boolean,showsNum:number,pageNum:number,orderedBy:string,search:string,listId?:string):Observable<Contacts[]>{
  return this.http.get<Contacts[]>(`${env.api}Contacts/listContacts?email=${email}&listId=${listId}&isCanceled=${isCanceled}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}

getNonListContacts(email:string,isCanceled:boolean,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<Contacts[]>{
  return this.http.get<Contacts[]>(`${env.api}Contacts/listContactsWithNoLists?email=${email}&isCanceled=${isCanceled}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}

addContact(name:string,mobileNumber:string,companyName:string,note:string,email:string,listId:string[],additionalContactParameters?:{name:string,value:string}[]):Observable<Contacts>{
  const data=additionalContactParameters && additionalContactParameters.length>0?{
    name:name,
    mobileNumber:mobileNumber,
    companyName:companyName,
    note:note,
    email: email,
    listId:listId,
    additionalContactParameters: additionalContactParameters
  }:{
    name:name,
    mobileNumber:mobileNumber,
    companyName:companyName,
    note:note,
    email: email,
    listId:listId,
  }

  return this.http.post<Contacts>(`${env.api}Contacts/addNewContact`,data)
}

updateContact(data):Observable<any>{

  return this.http.put(`${env.api}Contacts/updateContact`,data)
}


deleteContact(email:string,listIDs:string[]): Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${env.api}Contacts/deleteContact?email=${email}`,listIDs)
}

removeContactsFromOneList(contactsId:string[],listId:string[],email:string): Observable<ErrSucc>{
  const data={
    id:contactsId,
    newListId:listId,
    email:email
  }
    return this.http.put<ErrSucc>(`${env.api}Contacts/removeContactsFromOneList`,data)

}
removeContactsFromLists(id:string[],email:string): Observable<ErrSucc>{
  const data={
    id:id,
    email:email
  }
  return this.http.put<ErrSucc>(`${env.api}Contacts/removeContactsFromLists`,data)
}
addOrMoveContacts(ids:string[],newListIds:string[],email:string): Observable<ErrSucc>{
  const data ={
  id:ids,
  newListId:newListIds,
  email:email
}
return this.http.put<ErrSucc>(`${env.api}Contacts/addOrMoveContactsFromLists`,data)
}
contactsCount(email:string,isCanceled:boolean):Observable<number>{
  return this.http.get<number>(`${env.api}Contacts/listContactsCount?email=${email}&isCanceled=${isCanceled}`)
}
unDeleteList(email:string,ids:string[]):Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${env.api}Contacts/unDeleteList?email=${email}`,ids)
}
unDeleteContact(email:string,ids:string[]):Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${env.api}Contacts/unDeleteContact?email=${email}`,ids)
}
exportSelectedContacts(data): Observable<Blob> {
  const url = `${env.api}Contacts/exportSelectedContacts`;

  // Make the HTTP request and set responseType to 'blob' to expect a binary response
  return this.http.post(url, data, { responseType: 'blob' });
}
exportAllContacts():Observable<Blob> {
  const url = `${env.api}Contacts/exportAllContacts`;
  const params = new HttpParams().set('email', this.email);

  return this.http.post(url, {}, { responseType: 'blob', params });
}

exportContactsInList(listId: string): Observable<Blob> {
  // Create a URL-encoded query parameter string
  const queryParams = new HttpParams()
    .set('listId', listId)
    .set('email', this.email);

  const url = `${env.api}Contacts/exportContactsInList`;

  // Set responseType to 'blob' to expect a binary response
  return this.http.post(url, null, {
    responseType: 'blob',
    params: queryParams
  });
}

importFile(data):Observable<any>{
  return this.http.post<any>(`${env.api}Contacts/importFile`,data)

}

exportFileData(file){
  const now = new Date(); // Create a new Date object representing the current date and time

 // Extract date components (day, month, year)
 const day = now.getDate().toString().padStart(2, '0');
 const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so add 1
 const year = now.getFullYear();

 // Create the formatted date string in "dd/mm/yyyy" format
 const formattedDate = `${day}/${month}/${year}`;

 var downloadURL = window.URL.createObjectURL(file);
 var link = document.createElement('a');
 link.href = downloadURL;
 link.download = `Contacts-${formattedDate}.xlsx`;
 link.click();

   }
}
