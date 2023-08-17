import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CompainMessages, compaignDetails } from 'src/app/pages/compaigns/campaigns';
import { FormControl } from '@angular/forms';
import { CompaignsDetailsService } from '../../compaignsDetails.service';

export interface PeriodicElement {
  mobileNumber: string;
  name: string;
  replies: string;
  responseTime: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { mobileNumber: '24 May 2023', name: 'John Smith', replies: 'Lorem Ipsum', responseTime: 'N/A' },
  { mobileNumber: '24 May 2023', name: 'John Smith', replies: 'Lorem Ipsum', responseTime: 'N/A' },
  { mobileNumber: '24 May 2023', name: 'John Smith', replies: 'Lorem Ipsum', responseTime: 'N/A' },
  { mobileNumber: '24 May 2023', name: 'John Smith', replies: 'Lorem Ipsum', responseTime: 'N/A' },

];

@Component({
  selector: 'app-recipientActivities',
  templateUrl: './recipientActivities.component.html',
  styleUrls: ['./recipientActivities.component.scss']
})
export class RecipientActivitiesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Mobile Number', 'Name', 'Updated At', 'Status'];
  columns :FormControl;
  displayed: string[] = ['Mobile Number', 'Name', 'Updated At', 'Status'];
  loading;
  length:number=0;

  dataSource:MatTableDataSource<CompainMessages>;
  @Input() compaignId:string;

  @Input() compaign!:compaignDetails;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private compaignDetailsService:CompaignsDetailsService) {}
  ngOnInit() {
    this.columns=new FormControl(this.displayedColumns)

    this.getComMessages()
  }


  getComMessages(){
    this.getComMessagesCount();
  let shows=this.compaignDetailsService.display;
  let pageNum=this.compaignDetailsService.pageNum;
  let email=this.compaignDetailsService.email;


  this.loading = true;

    this.compaignDetailsService.listCampaignMessages(this.compaignId,email,shows,pageNum).subscribe(
      (res)=>{
        this.loading = false;

    this.dataSource=new MatTableDataSource<CompainMessages>(res);
    console.log(res)
        },
        (err)=>{
          this.loading = false;
          this.length=0

        }
    )

  }
  getComMessagesCount(){
    this.compaignDetailsService.listCampaignMessagesCount(this.compaignId).subscribe(
      (res)=>{
        this.length=res;

      }
      ,(err)=>{
        this.length=0;}
    )
  }
  ngAfterViewInit() {
  }

  onPageChange(event){
    this.compaignDetailsService.display=event.pageSize;
    this.compaignDetailsService.pageNum=event.pageIndex;


    this.getComMessages();
  }
  changeColumns(event){
    this.displayedColumns=[...event]


  }


}
