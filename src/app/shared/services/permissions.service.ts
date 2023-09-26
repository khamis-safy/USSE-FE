import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable, shareReplay } from 'rxjs';
import { Permission, Users } from 'src/app/pages/users/users';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
email=localStorage.getItem("email")
constructor(private http:HttpClient) { }
getUserByEmail():Observable<Users>{
  return this.http.get<Users>(`${env.api}Auth/getUserByEmail?Email=${this.email}`).pipe(
    shareReplay()
  )
}
executePermissions(permissions:{name:string,value:string}[]):Permission{
  const accessMap: { [key: string]: boolean } = {
    ReadOnly: true,
    FullAccess: true,
    None: false,
  };

  const singlePermissionObject: Permission = permissions.reduce((accumulator, permission) => {
    const permissionName = permission.name as keyof Permission;
    accumulator[permissionName] = accessMap[permission.value];
    return accumulator;
  }, {} as Permission);
return singlePermissionObject}
}
