import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CompainMessages, compaignDetails } from 'src/app/pages/compaigns/campaigns';
import { FormControl } from '@angular/forms';
import { CompaignsDetailsService } from '../../compaignsDetails.service';
import { RECEPEINTHEADERS } from 'src/app/pages/compaigns/constants/contstants';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CompaignsService } from 'src/app/pages/compaigns/compaigns.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ResendMessagesComponent } from 'src/app/pages/messages/Components/resendMessages/resendMessages.component';



@Component({
  selector: 'app-recipientActivities',
  templateUrl: './recipientActivities.component.html',
  styleUrls: ['./recipientActivities.component.scss']
})
export class RecipientActivitiesComponent implements OnInit, AfterViewInit,OnDestroy {
  columns :FormControl;
  displayed: string[] = RECEPEINTHEADERS;
  displayedColumns: string[] = ['Mobile Number', 'Name', 'Updated At', 'Status',"Ation"];
  loading;
  length:number=0;

  dataSource:MatTableDataSource<CompainMessages>;
  @Input() compaignId:string;

  @Input() compaign!:compaignDetails;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  display: number;
  pageNum: number;
  constructor(private compaignDetailsService:CompaignsDetailsService,public dialog: MatDialog,
    private compaignsService:CompaignsService,
    private authService:AuthService) {
      this.display=compaignsService.getUpdatedDisplayNumber();
      this.pageNum=this.compaignsService.pageNum;
    }
  ngOnInit() {
    this.columns=new FormControl(this.displayedColumns)

    this.getComMessages()
  }


  getComMessages(){
  let shows=this.compaignDetailsService.display;
  let email=this.authService.getUserInfo()?.email;


  this.loading = true;
  this.getComMessagesCount();

    this.compaignDetailsService.listCampaignMessages(this.compaignId,email,shows,this.pageNum).subscribe(
      (res)=>{
        this.loading = false;

    this.dataSource=new MatTableDataSource<CompainMessages>(res);
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
    this.pageNum=event.pageIndex;
    this.compaignsService.updateDisplayNumber(event.pageSize)

    this.getComMessages();
  }
  changeColumns(event){
    this.displayedColumns=[...event]


  }
  reSendCampaingMessage(campaignID,failedMsg){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.data ={
      from:"CampaignDetails",
      data: {
        campaignId: campaignID,
        messageIds:[failedMsg],
        email: this.authService.getUserInfo().email,
        resentAllFailedMessages: false
      }
    }
    
    const dialogRef = this.dialog.open(ResendMessagesComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getComMessages();
      }
    });
  }
  ngOnDestroy(): void {
    this.compaignDetailsService.display=10;
    this.compaignDetailsService.pageNum=0;
  }
}
