import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { CompaignStat, CompainMessages } from '../../campaigns';
import { AuthService } from 'src/app/shared/services/auth.service';



@Injectable({
  providedIn: 'root'
})
export class CompaignsDetailsService {
  display:number=10;
  pageNum:number=0;
  email:string=this.authService.getUserInfo()?.email;
  constructor(private http:HttpClient,private authService:AuthService) {

  }
  getCampaignStat(id:string,email:string):Observable<CompaignStat>{
    return this.http.get<CompaignStat>(`${env.api}Message/getCampaignStat?id=${id}&email=${email}`);
  }

  listCampaignMessages(id:string,email:string,showsNum:number,pageNum:number):Observable<CompainMessages[]>{
    return this.http.get<CompainMessages[]>(`${env.api}Message/listCampaignMessages?id=${id}&email=${email}&take=${showsNum}&scroll=${pageNum}`)
  }
  listCampaignMessagesCount(id:string):Observable<number>{
    return this.http.get<number>(`${env.api}Message/listCampaignMessagesCount?id=${id}`);
  }
}
