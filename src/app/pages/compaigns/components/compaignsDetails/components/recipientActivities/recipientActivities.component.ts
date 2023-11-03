import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CompainMessages, compaignDetails } from 'src/app/pages/compaigns/campaigns';
import { FormControl, FormGroup } from '@angular/forms';
import { CompaignsDetailsService } from '../../compaignsDetails.service';
import { RECEPEINTHEADERS } from 'src/app/pages/compaigns/constants/contstants';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CompaignsService } from 'src/app/pages/compaigns/compaigns.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ResendMessagesComponent } from 'src/app/pages/messages/Components/resendMessages/resendMessages.component';
import { TranslateService } from '@ngx-translate/core';



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
  filterdData :any= new FormControl([]);
  filteringForm= new FormGroup({
    filterdData:this.filterdData,
  });
filters:any;
@Output() tableDataLength = new EventEmitter<number>;

  dataSource:MatTableDataSource<CompainMessages>;
  @Input() compaignId:string;

  @Input() compaign!:compaignDetails;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  display: number;
  pageNum: number;
  constructor(private compaignDetailsService:CompaignsDetailsService,public dialog: MatDialog,
    private compaignsService:CompaignsService,
    private authService:AuthService,
    private translate:TranslateService,) {
      this.display=compaignsService.getUpdatedDisplayNumber();
      this.pageNum=this.compaignsService.pageNum;
      this.filters=[
        {title:this.translate.instant("Pending") ,value:1},
        {title:this.translate.instant("Sent") ,value:2},
        {title:this.translate.instant("Delivered") ,value:3},
        {title:this.translate.instant("Read") ,value:4},
        {title:this.translate.instant("failedLabel") ,value:5},
      
      ]
    }
    selectedItems:any=[
      {title:this.translate.instant("Pending") ,value:1},
      {title:this.translate.instant("Sent") ,value:2},
      {title:this.translate.instant("Delivered") ,value:3},
      {title:this.translate.instant("Read") ,value:4},
      {title:this.translate.instant("failedLabel") ,value:5},
    
    ]
  ngOnInit() {
    this.columns=new FormControl(this.displayedColumns)
    this.filteringForm.patchValue({
      filterdData:this.selectedItems
    }
    
    )
    this.getComMessages()
  }


  getComMessages(filteredData?){
  let shows=this.compaignDetailsService.display;
  let email=this.authService.getUserInfo()?.email;


  this.loading = true;
  this.getComMessagesCount(filteredData);

    this.compaignDetailsService.listCampaignMessages(this.compaignId,email,shows,this.pageNum,filteredData).subscribe(
      (res)=>{
        this.loading = false;

    this.dataSource=new MatTableDataSource<CompainMessages>(res);
        },
        (err)=>{
          this.loading = false;
          this.length=0;
          this.tableDataLength.emit(this.length)

        }
    )

  }
  getComMessagesCount(filteredData?){
    this.compaignDetailsService.listCampaignMessagesCount(this.compaignId,filteredData).subscribe(
      (res)=>{
        this.length=res;
        this.tableDataLength.emit(this.length)

      }
      ,(err)=>{
        this.length=0;
        this.tableDataLength.emit(this.length)
      }
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
  reSendCampaingMessage(messageId,failedCampaignId){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.data ={
      from:"CampaignDetails",
      data: {
        campaignId:failedCampaignId,
        messageIds:[messageId],
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
  selectFilter(item){
    // this.selectedItems.push(item);
      let selected= this.selectedItems.map((sel)=>sel.value-1)
      console.log("selected" , selected)
     this.getComMessages(selected)
    }
    deselectFilter(item){
      let selected= this.selectedItems.map((sel)=>sel.value-1)
      this.getComMessages(selected)

    }
}
