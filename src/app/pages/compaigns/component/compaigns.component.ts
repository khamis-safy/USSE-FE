import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { CompaignsService } from '../compaigns.service';
import { Router } from '@angular/router';
import { compaignDetails } from '../campaigns';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';



@Component({
  selector: 'app-compaigns',
  templateUrl: './compaigns.component.html',
  styleUrls: ['./compaigns.component.scss']
})
export class CompaignsComponent implements AfterViewInit ,OnInit {

  length:number=0;
  loading:boolean=false;
  cellClick:boolean=false;
  isCompagins:boolean=true;

  columns :FormControl;
  displayed: string[] = ['Name', 'Status', 'Creator Name', 'Start Date'];
  displayedColumns: string[] = ['Name', 'Status', 'Creator Name', 'Start Date','Action'];
  dataSource:MatTableDataSource<compaignDetails>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private compaignsService:CompaignsService,public dialog: MatDialog, private router:Router){}


  ngOnInit() {
    this.columns=new FormControl(this.displayedColumns)

    this.getCompaigns();
  }
  ngAfterViewInit() {
  }

  getCompaigns(){

    let shows=this.compaignsService.display;
    let pageNum=this.compaignsService.pageNum;
    let email=this.compaignsService.email;
    let search=this.compaignsService.search;
    this.loading = true;

    this.compaignsService.getCampaigns(email,shows,pageNum,search).subscribe(
      (res)=>{
        this.loading = false;
        this.dataSource=new MatTableDataSource<compaignDetails>(res);
        if(search!=""){
            this.length=res.length
        }
        else{
          this.compaignsCount();

        }
        console.log(res)

      },
      (err)=>{
       this.loading = false;
       this.length=0;

      }
    )
  }
compaignsCount(){
  let email=this.compaignsService.email;
  this.compaignsService.compaignsCount(email).subscribe(
    (res)=>{

      this.length=res;
    }
    ,(err)=>{
      this.length=0;
    }
  )

}
  changeColumns(event){
    this.displayedColumns=[...event]
    }

  addCampaigns(){
    this.isCompagins=false;
  }

  onPageChange(event){
    this.compaignsService.display=event.pageSize;
    this.compaignsService.pageNum=event.pageIndex;

    this.getCompaigns();

  }

  compaignDetails(com:compaignDetails){
    if(!this.cellClick){
      let id=com.id;
      this.router.navigateByUrl(`compaign/${id}`)
    }
  }
  stopComaign(element){
    console.log("stop compaign")
    this.compaignsService.stopWhatsappBusinessCampaign(element.id,this.compaignsService.email).subscribe(
      (res)=>{
        this.getCompaigns();

      },
      (err)=>{

      }
    )
  }
  deleteCompaign(element){
    console.log("delete compaign")

    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data =
    {
      compaignData:{compaignId:element.id}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getCompaigns();
      }
    });
  }

  onSearch(event:any){
    this.compaignsService.search=event.value;
    this.getCompaigns();
  }
}

