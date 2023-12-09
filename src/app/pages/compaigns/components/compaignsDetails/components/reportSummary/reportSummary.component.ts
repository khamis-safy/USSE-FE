import { AfterViewInit, Component, Input, OnInit, } from '@angular/core';
import { CompaignStat, compaignDetails } from 'src/app/pages/compaigns/campaigns';
import { CompaignsService } from 'src/app/pages/compaigns/compaigns.service';
import { CompaignsDetailsService } from '../../compaignsDetails.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-reportSummary',
  templateUrl: './reportSummary.component.html',
  styleUrls: ['./reportSummary.component.scss']
})
export class ReportSummaryComponent implements OnInit , AfterViewInit {
  @Input() compaign:compaignDetails;
  @Input() compaignId:string;
  campaignActions:{actionName:string, actionCriteras:any[]}[]=[];
  displayedColumns: string[] = ['index', 'name', "criterias"];
  dataSource:MatTableDataSource<any>;
  WrapperScrollLeft =0;
  WrapperOffsetWidth =250;
  statics:CompaignStat;
  campainHasActions:boolean=false;
  constructor(private compaignDetailsService:CompaignsDetailsService,
    private compaignsService:CompaignsService,
    private authService:AuthService) {

  }
  ngAfterViewInit() {
  
   
  }
  ngOnInit() {
this.getStatics();
this.getCompaignData();

  }
  getCompaignData(){
    this.compaignsService.getCampaignById(this.compaignId).subscribe(
    (res)=>{
        this.compaign=res;
        
        if(this.compaign?.actionCount > 0) {
          this.campainHasActions=true;
          this.campaignActions=this.compaign.actions.map((action)=>{
          return{
            actionName: action.actionName,
            actionCriteras: action[action.actionName].criterias.map((criteria)=>criteria.criteria)
          }
          })
      
          this.dataSource=new MatTableDataSource<any>(this.campaignActions)
        }
    },
    (err)=>{

    }
    )
  }
  scrollRight(element, wrapper: HTMLElement) {
    element.hideLeftArrow = false;
  element.WrapperOffsetWidth = wrapper.offsetWidth;

  // Calculate the total width of list items dynamically
  const totalListWidth = Array.from(wrapper.querySelectorAll('.criteriaName')).reduce((acc, listItem) => {
    // Calculate the width of each list item and add it to the accumulator
    const listItemWidth = listItem.clientWidth;
    return acc + listItemWidth;
  }, 0);

  

  // Update hideRightArrow based on the scroll position
  if (this.WrapperScrollLeft > totalListWidth - element.WrapperOffsetWidth) {
    element.hideRightArrow = true;
  } else {
    element.hideRightArrow = false;
  }
  this.WrapperScrollLeft = wrapper.scrollLeft + 100;
  // Scroll to the calculated position
  wrapper.scrollTo({
    left: this.WrapperScrollLeft,
    behavior: "smooth",
  });
  }
  scrollLeft(element , wrapper){
    element.hideRightArrow = false;
    this.WrapperScrollLeft =wrapper.scrollLeft-100
    if(this.WrapperScrollLeft<=5){
      this.WrapperScrollLeft =0;
      element.hideLeftArrow=true;
      
    }
    wrapper.scrollTo({
      left: this.WrapperScrollLeft,
      behavior: "smooth",
    })
    


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

