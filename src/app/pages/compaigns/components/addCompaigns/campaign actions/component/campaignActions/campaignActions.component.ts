import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AutoReplayComponent } from '../../components/autoReplay/autoReplay.component';
import { SubscribeToListComponent } from '../../components/subscribeToList/subscribeToList.component';
import { InquiryComponent } from '../../components/inquiry/inquiry.component';
import { CompaignsService } from 'src/app/pages/compaigns/compaigns.service';
 interface tableData {
  id:number;
  name: string;

}

@Component({
  selector: 'app-campaignActions',
  templateUrl: './campaignActions.component.html',
  styleUrls: ['./campaignActions.component.scss']
})
export class CampaignActionsComponent implements OnInit ,AfterViewInit {
  displayedColumns: string[] = ['Name', 'Operations'];
  dataSource :MatTableDataSource<any>;
  length:number=0;
  id:number=0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableData:any=[];
  actions:any=[];
  ngAfterViewInit() {
    if(this.dataSource){

      this.dataSource.paginator = this.paginator;
    }
  }
  constructor(private dialog: MatDialog , private campaignsService:CompaignsService) { }

  ngOnInit() {
  }
  deleteAction(element){
    let foundElementFromTable = this.tableData.find((data)=>data.id == element.id);
    this.tableData.splice(this.tableData.indexOf(foundElementFromTable) , 1);
    this.dataSource=new MatTableDataSource<any>(this.tableData)
    this.length=this.tableData.length;
    this.setActions();

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

        this.id++;
        if(elementData){
        let foundElementFromTable = this.tableData.find((element)=>element.id == elementData.id);
        foundElementFromTable.data=result;
      
        }
        else{
          
          this.tableData.push({
            id:this.id,
            name:actionName,
            data:result
            
          })

        }
        this.setActions();
        this.dataSource=new MatTableDataSource<any>(this.tableData)
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

        this.id++;
        if(elementData){
        let foundElementFromTable = this.tableData.find((element)=>element.id == elementData.id);
        foundElementFromTable.data=result;

        }
        else{

            this.tableData.push({
            id:this.id,
            name:"subscribeToList",
            data:result
            
          })

        }
        this.setActions();
        this.dataSource=new MatTableDataSource<any>(this.tableData)
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

        this.id++;
        if(elementData){
        let foundElementFromTable = this.tableData.find((element)=>element.id == elementData.id);
        foundElementFromTable.data=result;

        }
        else{
            this.tableData.push({
            id:this.id,
            name:"enqueryForm",
            data:result
            
          })

        }
        this.setActions();
        this.dataSource=new MatTableDataSource<any>(this.tableData)
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
  }
  getActions(){
    return this.actions
  }
}
