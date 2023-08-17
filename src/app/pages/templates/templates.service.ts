import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';

import { Observable } from 'rxjs';
import { CheckCon, Templates, Init } from './templates';
@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  showsNum:number=10;
  pageNum:number=0;
  email:string="khamis.safy@gmail.com";
  orderedBy:string="";
  search:string="";
constructor(private http:HttpClient) { }

getTemplates(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<Templates[]>{
  return this.http.get<Templates[]>(`${env.api}Template/listTemplates?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}

deleteTemplates(email:string,id:string):Observable<Templates>{
  return this.http.delete<Templates>(`${env.api}Template/deleteTemplate?email=${email}&id=${id}`)
}








addTemplate(templateName:string,messageBody:string,email:string,attachments:string[]):Observable<Templates>{
  const data=attachments.length!=0?{
    templateName: templateName,
    messageBody: messageBody,
    email: email,
    attachments:attachments
  }:{
    templateName: templateName,
    messageBody: messageBody,
    email: email
  }
  return this.http.post<Templates>(`${env.api}Template/addNewTemplate`,data)
}





updateTemplate(id:string,templateName:string,messageBody:string,email:string, attachments:string[]):Observable<any>{
  const data=attachments.length!=0?{
    id:id,
    templateName: templateName,
    messageBody: messageBody,
    email: email,
    attachments:attachments
  }:{
    id:id,
    templateName: templateName,
    messageBody: messageBody,
    email: email
  }
  return this.http.put(`${env.api}Template/updateTemplate`,data)
}




















}
