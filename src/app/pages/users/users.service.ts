import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';

import { Users } from './users';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  display:number=10;
  pageNum:number=0;
  orderedBy:string="";
  search:string="";
  token:string=this.authService.userInfo.refreshToken;
  organizationName:string=this.authService.userInfo.organizationName;
  id:string=this.authService.userInfo.id;
  constructor(private http:HttpClient,private authService:AuthService) {

  }

  listCustomersUsers(token:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<Users[]>{
    return this.http.get<Users[]>(`${env.api}Auth/listCustomersUsers?token=${token}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
  }

  listCustomersUsersCount(token:string):Observable<number>{
    return this.http.get<number>(`${env.api}Auth/listCustomersUsersCount?token=${token}`)
  }
  editUserPermissions(data):Observable<any>{

    return this.http.patch<any>(`${env.api}Auth/editUserPermissions`,data)
  }
}
