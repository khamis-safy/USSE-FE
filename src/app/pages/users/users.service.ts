import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Access, Permission, PermissionData, Users } from './users';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private api: string = environment.api;

  display:number=10;
  pageNum:number=0;
  orderedBy:string="";
  search:string="";
  email:string=this.authService.getUserInfo()?.email
  token:string;
  organizationName:string=this.authService.getUserInfo()?.organisationName;
  id:string=this.authService.getUserInfo()?.id;
  constructor(private http:HttpClient,private authService:AuthService) {
    this.token=this.getCookieValue("refreshToken")


  }
   getCookieValue(cookieName: string): string {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, encodedValue] = cookie.trim().split('=');
      if (name === cookieName) {

        return encodedValue;
      }
    }
    return null;
  }


  listCustomersUsers(token:string,showsNum:number,pageNum:number,orderedBy:string,search:string):Observable<Users[]>{
    return this.http.get<Users[]>(`${this.api}Auth/listCustomersUsers?email=${this.email}&token=${token}&take=${showsNum}&scroll=${pageNum}&orderedBy=${orderedBy}&search=${search}`)
  }

  listCustomersUsersCount(token:string):Observable<number>{
    return this.http.get<number>(`${this.api}Auth/listCustomersUsersCount?token=${token}`)
  }
  editUserPermissions(data):Observable<any>{

    return this.http.patch<any>(`${this.api}Auth/editUserPermissions`,data)
  }

 getUserByEmail(email:string):Observable<Users>{
  return this.http.get<Users>(`${this.api}Auth/getUserByEmail?Email=${email}`)
}
// executePermissions(permissions:{name:string,value:string}[]):Permission{
//   const accessMap: { [key: string]: boolean } = {
//     ReadOnly: true,
//     FullAccess: true,
//     None: false,
//   };

//   const singlePermissionObject: Permission = permissions.reduce((accumulator, permission) => {
//     const permissionName = permission.name as keyof Permission;
//     accumulator[permissionName] = accessMap[permission.value];
//     return accumulator;
//   }, {} as Permission);
// return singlePermissionObject
// }

deleteUser(customerEmail:string, userEmail:string):Observable<any>{
  return this.http.put<any>(`${this.api}Auth/deleteUser?userEmail=${userEmail}&customerEmail=${customerEmail}`,null)
  }

unDeleteUser(customerEmail:string, userEmail:string):Observable<any>{
  return this.http.put<any>(`${this.api}Auth/unDeleteUser?userEmail=${userEmail}&customerEmail=${customerEmail}`,null)
  }
  

}
