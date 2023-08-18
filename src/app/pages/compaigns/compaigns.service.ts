import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { Campaigns, compaignDetails } from './campaigns';


@Injectable({
  providedIn: 'root'
})
export class CompaignsService {
  display:number=10;
  pageNum:number=0;
  email:string="khamis.safy@gmail.com";
  search:string="";
constructor(private http:HttpClient) {

}
getCampaigns(email:string,showsNum:number,pageNum:number,search:string):Observable<compaignDetails[]>{
  return this.http.get<compaignDetails[]>(`${env.api}Message/listCampaigns?email=${email}&take=${showsNum}&scroll=${pageNum}&search=${search}`)
}
compaignsCount(email:string):Observable<number>{
  return this.http.get<number>(`${env.api}Message/listCampaignsCount?email=${email}`)
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
