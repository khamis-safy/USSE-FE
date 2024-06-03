import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ErrSucc, ListData } from './list-data';
import { Contacts } from './contacts';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionData } from '../users/users';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageContactsService {
  listName:string="";
  private api: string = environment.api;

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
  return this.http.post<ListData>(`${this.api}Contacts/addNewList`,data)
}

updateList(id:string,name:string,email:string): Observable<ListData>{
const data ={
    id:id,
    name:name,
    email:email
  }
  return this.http.put<ListData>(`${this.api}Contacts/updateList`,data)
}

deleteList(email:string,listArr:string[]): Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${this.api}Contacts/deleteList?email=${email}`,listArr)
}
getList(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<ListData[]>{
  return this.http.get<ListData[]>(`${this.api}Contacts/listLists?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`).pipe(
    shareReplay()
  )
}
ListsCount(email:string):Observable<number>{
  return this.http.get<number>(`${this.api}Contacts/listListsCount?email=${email}`).pipe(
    shareReplay()
  )
}


getListById(listId:string): Observable<ListData>{

    return this.http.get<ListData>(`${this.api}Contacts/getListById?id=${listId}`)
  }

// contacts methods
getContacts(email:string,isCanceled:boolean,showsNum:number,pageNum:number,orderedBy:string,search:string,listId?:string):Observable<Contacts[]>{
  return this.http.get<Contacts[]>(`${this.api}Contacts/listContacts?email=${email}&listId=${listId}&isCanceled=${isCanceled}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`).pipe(
    shareReplay()
  )
}

getNonListContacts(email:string,isCanceled:boolean,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<Contacts[]>{
  return this.http.get<Contacts[]>(`${this.api}Contacts/listContactsWithNoLists?email=${email}&isCanceled=${isCanceled}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}

addContact(name:string,mobileNumber:string,email:string,listId:string[],additionalContactParameters?:{name:string,value:string}[]):Observable<Contacts>{
  const data=additionalContactParameters && additionalContactParameters.length>0?{
    name:name,
    mobileNumber:mobileNumber,
   
    email: email,
    listId:listId,
    additionalContactParameters: additionalContactParameters
  }:{
    name:name,
    mobileNumber:mobileNumber,
   
    email: email,
    listId:listId,
  }

  return this.http.post<Contacts>(`${this.api}Contacts/addNewContact`,data)
}

updateContact(data):Observable<any>{

  return this.http.put(`${this.api}Contacts/updateContact`,data)
}


deleteContact(email:string,listIDs:string[]): Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${this.api}Contacts/deleteContact?email=${email}`,listIDs)
}

removeContactsFromOneList(contactsId:string[],listId:string[],email:string): Observable<ErrSucc>{
  const data={
    id:contactsId,
    newListId:listId,
    email:email
  }
    return this.http.put<ErrSucc>(`${this.api}Contacts/removeContactsFromOneList`,data)

}
removeContactsFromLists(id:string[],email:string): Observable<ErrSucc>{
  const data={
    id:id,
    email:email
  }
  return this.http.put<ErrSucc>(`${this.api}Contacts/removeContactsFromLists`,data)
}
addOrMoveContacts(ids:string[],newListIds:string[],email:string): Observable<ErrSucc>{
  const data ={
  id:ids,
  newListId:newListIds,
  email:email
}
return this.http.put<ErrSucc>(`${this.api}Contacts/addOrMoveContactsFromLists`,data)
}
contactsCount(email:string,isCanceled:boolean):Observable<number>{
  return this.http.get<number>(`${this.api}Contacts/listContactsCount?email=${email}&isCanceled=${isCanceled}`).pipe(
    shareReplay()
  )
}
cancelContacts(email:string,cantactsIds:string[]):Observable<any>{
  return this.http.put<any>(`${this.api}Contacts/CancelContact?email=${email}`,cantactsIds)
}
unCancelContacts(email:string,cantactsIds:string[]):Observable<any>{
  return this.http.put<any>(`${this.api}Contacts/unCancelContact?email=${email}`,cantactsIds)
}
unDeleteList(email:string,ids:string[]):Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${this.api}Contacts/unDeleteList?email=${email}`,ids)
}
unDeleteContact(email:string,ids:string[]):Observable<ErrSucc>{
  return this.http.put<ErrSucc>(`${this.api}Contacts/unDeleteContact?email=${email}`,ids)
}
exportSelectedContacts(data: any, fileType: string): Observable<Blob> {
  const url = `${this.api}Contacts/exportSelectedContacts`;
  const params = new HttpParams().set('fileType', fileType);
  return this.http.post(url, data, { responseType: 'blob', params });
}

exportAllContacts(fileType: string): Observable<Blob> {
  const url = `${this.api}Contacts/exportAllContacts`;
  const params = new HttpParams().set('email', this.email).set('fileType', fileType);

  return this.http.post(url, {}, { responseType: 'blob', params });
}


exportContactsInList(listId: string,fileType:string): Observable<Blob> {
  // Create a URL-encoded query parameter string
  const queryParams = new HttpParams()
    .set('listId', listId)
    .set('email', this.email)
    .set('fileType', fileType);
  const url = `${this.api}Contacts/exportContactsInList`;

  // Set responseType to 'blob' to expect a binary response
  return this.http.post(url, null, {
    responseType: 'blob',
    params: queryParams
  });
}

importFile(data):Observable<any>{
  return this.http.post<any>(`${this.api}Contacts/importFile`,data)

}

exportFileData(file , type){
  const now = new Date(); // Create a new Date object representing the current date and time
  let fileType = type=='excel'? 'xlsx':'vcf'

 // Extract date components (day, month, year)
 const day = now.getDate().toString().padStart(2, '0');
 const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so add 1
 const year = now.getFullYear();

 // Create the formatted date string in "dd/mm/yyyy" format
 const formattedDate = `${day}/${month}/${year}`;

 var downloadURL = window.URL.createObjectURL(file);
 var link = document.createElement('a');
 link.href = downloadURL;
 link.download = `Contacts-${formattedDate}.${fileType}`;
 link.click();

   }
   updateDisplayNumber(displayNum){
    displayNum=this.display;
   }
  getUpdatedDisplayNumber(){
    return this.display
  }
  arraysContainSameObjects(arr1: any[], arr2: any[]): boolean {
    // Check if arrays have the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Check if every object in arr1 exists in arr2
    return arr1.every(obj1 => {
        // Find an object in arr2 with the same ID
        const obj2 = arr2.find(obj => obj['id'] === obj1['id']);
        // Check if the object exists in arr2
        return obj2 !== undefined;
    });
}
}
