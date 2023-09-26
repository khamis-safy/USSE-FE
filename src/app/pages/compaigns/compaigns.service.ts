import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { Campaigns, compaignDetails } from './campaigns';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionData } from '../users/users';
import { ActivatedRoute } from '@angular/router';

export interface DevicesPermissions{deviceId:string,value:string}
@Injectable({
  providedIn: 'root'
})
export class CompaignsService  {
  display:number=10;
  pageNum:number=0;
  email:string=this.authService.userInfo.email;
  search:string="";
  compaignssPermission:PermissionData[];
  devicesPermissions:DevicesPermissions[];
constructor(private http:HttpClient,
  private authService:AuthService,
  private route: ActivatedRoute
  ) {

    // const permissions=this.getPermissionsFromRoute()

    // console.log("campaigns permissions",permissions)
  if(authService.userInfo.customerId!=""){
    // this.compaignssPermission=authService.devicesPermissions(authService.usersPermissions,"Campaigns");
    // if(this.compaignssPermission){
    //   this.devicesPermissions=this.compaignssPermission.map((permission)=>{

    //     let name=permission.name
    //     const underscoreIndex = permission.name.indexOf("_");
    //     let deviceId=name.substring(underscoreIndex + 1)

    //     return {
    //       deviceId:deviceId,
    //       value:permission.value
    //     }
    //   })
    //   console.log(this.devicesPermissions)
    // }

//       this.compaignssPermission=authService.devicesPermissions(permissions,"Campaigns");
//       if(this.compaignssPermission){
//         this.devicesPermissions=this.compaignssPermission.map((permission)=>{

//           let name=permission.name
//           const underscoreIndex = permission.name.indexOf("_");
//           let deviceId=name.substring(underscoreIndex + 1)

//           return {
//             deviceId:deviceId,
//             value:permission.value
//           }
//         })
//         console.log(this.devicesPermissions)
//       }









authService.getUserDataObservable().subscribe(permissions => {

      this.compaignssPermission=authService.devicesPermissions(permissions,"Campaigns");
      if(this.compaignssPermission){
        this.devicesPermissions=this.compaignssPermission.map((permission)=>{

          let name=permission.name
          const underscoreIndex = permission.name.indexOf("_");
          let deviceId=name.substring(underscoreIndex + 1)

          return {
            deviceId:deviceId,
            value:permission.value
          }
        })
        console.log(this.devicesPermissions)
      }






    });


   }

}
getPermissionsFromRoute(): { name: string, value: string }[] | undefined {
  const data = this.route.snapshot.data;
  if (data && data['permissions']) {
    return data['permissions'];
  } else {
    return undefined; // Handle the case where permissions are not available
  }
}
getCampaigns(email:string,showsNum:number,pageNum:number,search:string,deviceId:string):Observable<compaignDetails[]>{
  return this.http.get<compaignDetails[]>(`${env.api}Message/listCampaigns?email=${email}&take=${showsNum}&scroll=${pageNum}&search=${search}&deviceId=${deviceId}`)
}
compaignsCount(email:string,deviceId:string):Observable<number>{
  return this.http.get<number>(`${env.api}Message/listCampaignsCount?email=${email}&deviceId=${deviceId}`)
}
// addMewCampain(
//   campaignName: string,
//   scheduledAt: string,
//   isRepeatable: true,
//   repeatedDays: number,
//   intervalFrom: number,
//   intervalTo: number,
//   blackoutFrom: string,
//   blackoutTo: string,
//   maxPerDay: number,
//   attachments:string[],
//   lists:string[],
//   email: string,
//   msgBody: string,
//   deviceId: string
// ):Observable<any>{
//   const data={
//     campaignName: campaignName,
//     scheduledAt: scheduledAt,
//     isRepeatable: isRepeatable,
//     repeatedDays: repeatedDays,
//     intervalFrom: intervalFrom,
//     intervalTo: intervalTo,
//     blackoutFrom: blackoutFrom,
//     blackoutTo: blackoutTo,
//     maxPerDay: maxPerDay,
//     attachments:attachments,
//     lists:lists,
//     email: email,
//     msgBody: msgBody,
//     deviceId: deviceId
//   }
//   return this.http.post<any>(`${env.api}Message/createWhatsappBusinessCampaign?email=${email}`,data)
// }
addMewCampain(data:any):Observable<any>{
  return this.http.post<any>(`${env.api}Message/createWhatsappBusinessCampaign?email=${data.email}`,data)
}
stopWhatsappBusinessCampaign(id:string,email:string):Observable<any>{
  return this.http.put<any>(`${env.api}Message/stopWhatsappBusinessCampaign?id=${id}&email=${email}`,'')
}
getCampaignById(id:string):Observable<compaignDetails>{
  return this.http.get<compaignDetails>(`${env.api}Message/getCampaignById?id=${id}`);
}

deleteWhatsappBusinessCampaign(id:string,email:string):Observable<any>{
  return this.http.put<any>(`${env.api}Message/deleteWhatsappBusinessCampaign?id=${id}&email=${email}`,'')
}
}
