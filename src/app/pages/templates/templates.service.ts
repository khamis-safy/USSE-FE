import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
  display:number=10;
  pageNum:number=0;
  email:string="khamis.safy@gmail.com";
  orderedBy:string="messageASC";
  search:string="";
constructor(private http:HttpClient) { }
getTemplates(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<any>{
  return this.http.get<any>(`${env.api}Template/listTemplates?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}
}
