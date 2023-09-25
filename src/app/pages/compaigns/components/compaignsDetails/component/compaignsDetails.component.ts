import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { compaignDetails } from '../../../campaigns';
import { CompaignsService } from '../../../compaigns.service';
import { ReportSummaryComponent } from '../components/reportSummary/reportSummary.component';
import { CompaignsDetailsService } from '../compaignsDetails.service';
import { RecipientActivitiesComponent } from '../components/recipientActivities/recipientActivities.component';

@Component({
  selector: 'app-compaignsDetails',
  templateUrl: './compaignsDetails.component.html',
  styleUrls: ['./compaignsDetails.component.scss']
})
export class CompaignsDetailsComponent implements OnInit ,AfterViewInit{
  compaignId:string;
  compaign:compaignDetails;
  @ViewChild(ReportSummaryComponent) reportSummaryComponent:ReportSummaryComponent;
  @ViewChild(RecipientActivitiesComponent) recipientActivitiesComponent:RecipientActivitiesComponent;
  selectedTab="summary";
  tabs=["summary","activity"]
  constructor(private activeRoute:ActivatedRoute,public dialog: MatDialog,
    private compaignsService:CompaignsService,
    private compaignDetailsService:CompaignsDetailsService,
    private toaster: ToasterServices,
    private router:Router) {
    activeRoute.paramMap.subscribe((data)=>
    {
    this.compaignId=data.get('id');

    })
  }
  ngAfterViewInit() {
    this.reportSummaryComponent.compaign=this.compaign
    this.reportSummaryComponent.compaignId=this.compaignId;
    // this.listContacts.count=this.count;
    // this.listContacts.getContacts();
        }

  ngOnInit() {
    this.getCompaignData();

    }
    resetTableData(ev){
      this.compaignDetailsService.display=10;
      this.compaignDetailsService.pageNum=0;
      this.selectedTab = this.tabs[ev.index]

    }
    getCompaignData(){
      this.compaignsService.getCampaignById(this.compaignId).subscribe(
      (res)=>{
          this.compaign=res;
      },
      (err)=>{

      }
      )
    }

    backToCompaigns(){
      this.router.navigateByUrl('compaigns')
        }
  }

