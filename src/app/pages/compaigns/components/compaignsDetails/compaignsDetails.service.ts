import { HttpClient, HttpParams } from '@angular/common/http';
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

  listCampaignMessages(id: string, email: string, showsNum: number, pageNum: number, StatusFilters?: number[]): Observable<CompainMessages[]> {
    let params = new HttpParams()
      .set('id', id)
      .set('email', email)
      .set('take', showsNum.toString())
      .set('scroll', pageNum.toString());
  
    // Check if StatusFilters is provided and is an array
    if (StatusFilters && Array.isArray(StatusFilters)) {
      StatusFilters.forEach((filter) => {
        params = params.append('StatusFilters', filter.toString());
      });
    }
  
    const apiUrl = `${this.api}Message/listCampaignMessages`;
  
    return this.http.get<CompainMessages[]>(apiUrl, { params: params });
  }
  listCampaignMessagesCount(id: string, StatusFilters?: number[]): Observable<number> {
    let params = new HttpParams().set('id', id);
  
    // Check if StatusFilters is provided and is an array
    if (StatusFilters && Array.isArray(StatusFilters)) {
      StatusFilters.forEach((filter) => {
        params = params.append('StatusFilters', filter.toString());
      });
    }
  
    const apiUrl = `${this.api}Message/listCampaignMessagesCount`;
  
    return this.http.get<number>(apiUrl, { params: params });
  }
  resendCampaignFailedMessages(data):Observable<any>{
    return this.http.post<any>(`${this.api}Message/resendCampaignFailedMessages`,data);
  }
}
