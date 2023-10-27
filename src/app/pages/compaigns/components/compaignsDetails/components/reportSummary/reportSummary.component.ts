import { Component, Input, OnInit, } from '@angular/core';
import { CompaignStat, compaignDetails } from 'src/app/pages/compaigns/campaigns';
import { CompaignsService } from 'src/app/pages/compaigns/compaigns.service';
import { CompaignsDetailsService } from '../../compaignsDetails.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-reportSummary',
  templateUrl: './reportSummary.component.html',
  styleUrls: ['./reportSummary.component.scss']
})
export class ReportSummaryComponent implements OnInit{
  @Input() compaign!:compaignDetails;
  @Input() compaignId:string;


  statics:CompaignStat;
  constructor(private compaignDetailsService:CompaignsDetailsService,
    private authService:AuthService) {

  }
  ngOnInit() {
this.getStatics();
  }

getStatics(){

  this.compaignDetailsService.getCampaignStat(this.compaignId,this.authService.getUserInfo()?.email).subscribe(
    (res)=>{
      this.statics=res
    },
    (err)=>{
    }
  )
}


  }

