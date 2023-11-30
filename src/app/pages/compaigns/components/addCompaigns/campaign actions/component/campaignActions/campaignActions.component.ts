import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AutoReplayComponent } from '../../components/autoReplay/autoReplay.component';
import { SubscribeToListComponent } from '../../components/subscribeToList/subscribeToList.component';
import { InquiryComponent } from '../../components/inquiry/inquiry.component';
import { CompaignsService } from 'src/app/pages/compaigns/compaigns.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConfirmaionsComponent } from '../../../confirmaions/confirmaions.component';


@Component({
  selector: 'app-campaignActions',
  templateUrl: './campaignActions.component.html',
  styleUrls: ['./campaignActions.component.scss']
})
export class CampaignActionsComponent implements OnInit ,AfterViewInit,OnDestroy {
  displayedColumns: string[] = ['Name', 'Operations'];
  dataSource :MatTableDataSource<any>;
  length:number=0;
  id:number=-1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableData:any=[];
  actions:any=[];
  @Output() actionsData = new EventEmitter<any>
  @Input() deviceId:string;
  @Input() isCampaignAction:boolean=false;
  @Output() formValidityChange = new EventEmitter<boolean>(true);
  hideApplyButton:boolean=false;
  MessageAfterTimeOut : any = new FormControl('',Validators.required);
  sessionTimeOut: any = new FormControl(15);
  email:string=this.authService.getUserInfo()?.email
  campArr:SelectOption[];
  selectedCampaigns = new FormControl([]);
  form = new FormGroup({

    selectedCampaigns:this.selectedCampaigns,

  });
  listsLoadingText:string=this.translate.instant('Loading')
  selectedCampaignActions:any=[];
  campaignId:string;

    selecetedCampainsIDs:string[]=[]


    ngOnDestroy(): void {

  
    }
  ngAfterViewInit() {
    if(this.dataSource){

      this.dataSource.paginator = this.paginator;
    }
  }
  constructor(private dialog: MatDialog ,
      private campaignsService:CompaignsService,
      private translate: TranslateService,
      private authService:AuthService,) { }

  ngOnInit() {
    if(this.isCampaignAction){
      this.getCampaings()
    }
  
  }
  getCampaings(){
    this.campaignsService.getCampaigns(this.email,100,0,"",this.deviceId).subscribe(
      (res)=>{
        let campWithActions = res.filter((withActions)=>withActions.actionCount>0);
        console.log(campWithActions)
        if(campWithActions.length==0){
          this.listsLoadingText=this.translate.instant('No Results')
        }
        else{
          this.campArr=campWithActions.map(res=>{
            return {
              title:res.campaignName,
              value:res.id,
             
            }
          });
        }
        },
        (err)=>{

        this.listsLoadingText=this.translate.instant('No Results')

        })
    }
  onSearch(){
    this.listsLoadingText=this.translate.instant('No Results')
  }
  onSelect(event){
  this.campaignId=event.value;
  if(this.selecetedCampainsIDs.includes(event.value)){
    this.hideApplyButton = true;
  }
  else{
    this.hideApplyButton = false;

  }
  }
  deleteAction(element){
    let foundElementFromTable = this.tableData.find((data)=>data.id == element.id);
    this.tableData.splice(this.tableData.indexOf(foundElementFromTable) , 1);
    this.dataSource=new MatTableDataSource<any>(this.tableData)
    this.dataSource.paginator = this.paginator;

    this.length=this.tableData.length;
    if(this.length==0){
      this.id=-1;
      if(this.isCampaignAction){
    
        this.form.patchValue({
          selectedCampaigns:null
        })
        this.campaignId=null
      }
    }
    this.setActions();

  }
 fillTableData(actions:any[]){
  this.id=-1;
  this.tableData=actions.map((action)=>{
    this.id++;
    return{
      id:this.id,
      name: action.actionName,
      data: action[action.actionName]
    }
  })
  this.dataSource=new MatTableDataSource<any>(this.tableData);
  this.dataSource.paginator = this.paginator;
  this.setActions();

 }
 clearTableData(){
  this.tableData=[];
  this.dataSource=new MatTableDataSource<any>(this.tableData);
  this.dataSource.paginator = this.paginator;
  if(this.campaignId){
    this.hideApplyButton = false;
  }
  this.setActions();
  this.id=-1;
  if(this.isCampaignAction){

    this.form.patchValue({
      selectedCampaigns:null
    })
    this.campaignId=null
  }
 }
 applyCampaignActions(){
  const dialogConfig=new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.height='45vh';
  dialogConfig.width='35vw';
  dialogConfig.maxWidth='100%';
  dialogConfig.minWidth='465px';
  dialogConfig.data ={id:this.campaignId, action:'apply'}
  const dialogRef = this.dialog.open(ConfirmaionsComponent,dialogConfig);
  dialogRef.afterClosed().subscribe(result => {
    if(result){
      console.log("result",result)
      this.selecetedCampainsIDs.push(this.campaignId);
      this.hideApplyButton = true;

      this.fillTableData(result);
    }
  });
}
clearAllActions(){
  const dialogConfig=new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.height='45vh';
  dialogConfig.width='35vw';
  dialogConfig.maxWidth='100%';
  dialogConfig.minWidth='465px';
  dialogConfig.data ={action:'clear'}
 
  const dialogRef = this.dialog.open(ConfirmaionsComponent,dialogConfig);
  dialogRef.afterClosed().subscribe(result => {
    if(result){
      this.clearTableData();
    }
  });
}
  editAction(element){
    if(element.name == "autoReply" || element.name=="sendAndWait" || element.name=="cancel" ) {
    
      this.openAutoReply(element.name , element)
    }
    else if(element.name == "subscribeToList" ){
      this.openSubscribeToList(element)
    }
    else if(element.name == "enqueryForm" ){
      this.openInquiry(element)
      
    }
    
  }
  openAutoReply(actionName:string,elementData?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='90vh';
    dialogConfig.width='55vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='565px';
    dialogConfig.disableClose = true;
    dialogConfig.data={data:elementData?.data, actionName:actionName};
    const dialogRef = this.dialog.open(AutoReplayComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){

        if(elementData){
        let foundElementFromTable = this.tableData.find((element)=>element.id == elementData.id);
        foundElementFromTable.data=result;
      
        }
        else{
          this.id++;
          this.tableData.push({
            id:this.id,
            name:actionName,
            data:result
            
          })

        }
        this.setActions();
        this.dataSource=new MatTableDataSource<any>(this.tableData)
        this.dataSource.paginator = this.paginator;

        this.length=this.tableData.length

      
      }

    });
  }
  openSubscribeToList(elementData?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='90vh';
    dialogConfig.width='55vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='565px';
    dialogConfig.disableClose = true;
    dialogConfig.data=elementData?.data;
    const dialogRef = this.dialog.open(SubscribeToListComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){

        if(elementData){
        let foundElementFromTable = this.tableData.find((element)=>element.id == elementData.id);
        foundElementFromTable.data=result;

        }
        else{
          this.id++;
          this.tableData.push({
          id:this.id,
          name:"subscribeToList",
          data:result
            
          })

        }
        this.setActions();
        this.dataSource=new MatTableDataSource<any>(this.tableData)
        this.dataSource.paginator = this.paginator;

        this.length=this.tableData.length

      
      }

    });
  }
  openInquiry(elementData?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='90vh';
    dialogConfig.width='55vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='565px';
    dialogConfig.disableClose = true;
    dialogConfig.data=elementData?.data;
    const dialogRef = this.dialog.open(InquiryComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){

        if(elementData){
        let foundElementFromTable = this.tableData.find((element)=>element.id == elementData.id);
        foundElementFromTable.data=result;

        }
        else{
            this.id++;
            this.tableData.push({
            id:this.id,
            name:"enqueryForm",
            data:result
            
          })

        }
        this.setActions();
        this.dataSource=new MatTableDataSource<any>(this.tableData)
        this.dataSource.paginator = this.paginator;

        this.length=this.tableData.length

      
      }

    });
  }
  setActions(){
    this.actions=[];
    this.tableData.map((action)=> {
      if(action.name == "autoReply"){
        this.actions.push({
          actionName:"autoReply",
          autoReply:action.data
        })
      }
      
      else if (action.name == "subscribeToList"){
        this.actions.push({
          actionName:"subscribeToList",
          subscribeToList:action.data
        })
      }
      else if (action.name == "sendAndWait"){
        this.actions.push({
          actionName:"sendAndWait",
          sendAndWait:action.data
        })
      }
      // else if (action.name == "forwardedNumbers"){
        
      // }
      // else if (action.name == "email"){
        
      // }
      else if (action.name == "cancel"){
        this.actions.push({
          actionName:"cancel",
          cancel:action.data
        })
      }
      else if (action.name == "enqueryForm"){
        this.actions.push({
          actionName:"enqueryForm",
          enqueryForm:this.campaignsService.filteredObject(action.data)
        })
      }
    
    })
    this.actionsData.emit(this.actions)
  }
  getActions(){
    return this.actions
  }
}
