import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CompaignStat, CompainMessages } from '../../campaigns';
import { AuthService } from 'src/app/shared/services/auth.service';



@Injectable({
  providedIn: 'root'
})
export class CompaignsDetailsService {
  display:number=10;
  pageNum:number=0;
  // email:string=this.authService.getUserInfo()?.email;
  private api: string = environment.api;

  constructor(private http:HttpClient,private authService:AuthService) {

  }
  getCampaignStat(id:string,email:string):Observable<CompaignStat>{
    return this.http.get<CompaignStat>(`${this.api}Message/getCampaignStat?id=${id}&email=${email}`);
  }

  listCampaignMessages(id:string,email:string,showsNum:number,pageNum:number):Observable<CompainMessages[]>{
    return this.http.get<CompainMessages[]>(`${this.api}Message/listCampaignMessages?id=${id}&email=${email}&take=${showsNum}&scroll=${pageNum}`)
  }
  listCampaignMessagesCount(id:string):Observable<number>{
    return this.http.get<number>(`${this.api}Message/listCampaignMessagesCount?id=${id}`);
  }
}
