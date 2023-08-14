import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';

import { Observable } from 'rxjs';
import { CheckCon, Templates, Init } from './templates';
@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  display:number=10;
  pageNum:number=0;
  email:string="khamis.safy@gmail.com";
  orderedBy:string="";
  search:string="";
constructor(private http:HttpClient) { }
getTemplates(email:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<Templates[]>{
  return this.http.get<Templates[]>(`${env.api}Template/listTemplates?email=${email}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
}






}
