import { HttpClient } from '@angular/common/http';
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
    email:string=this.authService.userInfo.email;
    orderedBy:string="";
    search:string="";
    contactsPermissions:PermissionData;
  constructor(private http:HttpClient,private authService:AuthService) {
    if(authService.userInfo.customerId!=""){
      authService.getPermissionsObservable().subscribe(permissions => {
        this.contactsPermissions=permissions.find((e)=>e.name=="Contacts");
        if(!this.contactsPermissions){
          this.contactsPermissions={name:"Contacts",value:"ReadOnly"}
        }

        console.log(this.contactsPermissions)

        // Update your sidebar links based on the updated permissions
      });
     }
     else{
       this.contactsPermissions={name:"Contacts",value:"FullAccess"}
       console.log(this.contactsPermissions)
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

unDeleteList(email:string,ids:string[]):Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${env.api}Contacts/unDeleteList?email=${email}`,ids)
}
getListById(listId:string): Observable<ListData>{

    return this.http.get<ListData>(`${env.api}Contacts/getListById?id=${listId}`)
  }

// contacts methods
getContacts(email:string,isCanceled:boolean,showsNum:number,pageNum:number,orderedBy:string,search:string,listId?:string):Observable<Contacts[]>{
  return this.http.get<Contacts[]>(`${env.api}Contacts/listContacts?email=${email}&listId=${listId}&isCanceled=${isCanceled}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
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

updateContact(id:string,name:string,mobileNumber:string,companyName:string,note:string,email:string,newListId?:string[]):Observable<any>{
  const data=newListId?{
    id:id,
    name: name,
    mobileNumber: mobileNumber,
    companyName: companyName,
    note: note,
    email: email,
    newListId:newListId
  }:{
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




unDeleteContact(email:string,ids:string[]):Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${env.api}Contacts/unDeleteContact?email=${email}`,ids)
}
}
