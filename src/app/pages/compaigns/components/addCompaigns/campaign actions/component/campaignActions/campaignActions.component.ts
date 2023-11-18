import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AutoReplayComponent } from '../../components/autoReplay/autoReplay.component';
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
  constructor(private dialog: MatDialog) { }

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
    if(element.name == "autoReply") {
    
      this.openAutoReply(element)
    }
    
  }
  openAutoReply(actionName:string,data?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='90vh';
    dialogConfig.width='55vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='565px';
    dialogConfig.disableClose = true;
    dialogConfig.data={data:data, actionName:actionName};
    const dialogRef = this.dialog.open(AutoReplayComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){

        this.id++;
        if(data){
        let foundElementFromTable = this.tableData.find((element)=>element.id == data.id);
        foundElementFromTable.data=result.data;
      
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
  opensendAndWait(){

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
      
      // else if (action.name == "subscribeToList"){

      // }
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
      // else if (action.name == "cancel"){
        
      // }
      // else if (action.name == "enqueryForm"){
        
      // }
    })
  }
  getActions(){
    return this.actions
  }
}
