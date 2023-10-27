import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Permission, Users } from 'src/app/pages/users/users';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private api: string = environment.api;

constructor(private http:HttpClient) { }
getUserByEmail(email):Observable<Users>{
  return this.http.get<Users>(`${this.api}Auth/getUserByEmail?Email=${email}`).pipe(
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
