import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';

import { Observable } from 'rxjs';
import { CheckCon, Templates, Init, TemplateData } from './templates';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionData } from '../users/users';
@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  showsNum:number=10;
  pageNum:number=0;
  email:string=this.authService.userInfo.email;
  orderedBy:string="";
  search:string="";
  TemplatesPermission:PermissionData;

constructor(private http:HttpClient,private authService:AuthService) {
  if(authService.userInfo.customerId!=""){
    this.TemplatesPermission=authService.usersPermissions.find((e)=>e.name=="Templates");
   }
   else{
     this.TemplatesPermission={name:"Templates",value:"FullAccess"}
     console.log(this.TemplatesPermission)
   }
 }

getTemplates(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<Templates[]>{
  return this.http.get<Templates[]>(`${env.api}Template/listTemplates?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}

deleteTemplates(email:string,id:string):Observable<Templates>{
  return this.http.delete<Templates>(`${env.api}Template/deleteTemplate?email=${email}&id=${id}`)
}
listTemplatesCount(email:string):Observable<number>{
  return this.http.get<number>(`${env.api}Template/listTemplatesCount?email=${email}`)
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
















getTemplateById(id:string):Observable<TemplateData>{
  return this.http.get<TemplateData>(`${env.api}Template/getTemplateById?id=${id}`)
}


calculateFileSizeInKB(base64String: string): number {
  let base64=base64String.substring(base64String.indexOf(",")+1,base64String.length+1)
  // Decode the Base64 string to binary data
  const binaryData = atob(base64);

  // Calculate the length of the binary data
  const fileSizeInBytes = binaryData.length;

  // Convert the file size to kilobytes (KB)
  const fileSizeInKB = fileSizeInBytes / 1024;

  return fileSizeInKB;
}
extractTypeFromBase64(base64String: string):string{
  let type =base64String.substring(base64String.indexOf(":")+1,base64String.indexOf(";") );
  return type
}
}
