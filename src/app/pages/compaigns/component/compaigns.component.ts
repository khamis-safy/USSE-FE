import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { CompaignsService } from '../compaigns.service';
import { Router } from '@angular/router';
import { compaignDetails } from '../campaigns';



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
  dataSource:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private compaignsService:CompaignsService, private router:Router){}


  ngOnInit() {
    this.columns=new FormControl(this.displayedColumns)

    this.getCompaigns();
  }
  ngAfterViewInit() {
  }

  getCompaigns(){
    this.compaignsCount();
    let shows=this.compaignsService.display;
    let pageNum=this.compaignsService.pageNum;
    let email=this.compaignsService.email;
    let search=this.compaignsService.search;
    this.loading = true;
    this.compaignsService.getCampaigns(email,shows,pageNum,search).subscribe(
      (res)=>{
        this.loading = false;
        this.dataSource=new MatTableDataSource<any>(res)
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
    // console.log("stop compaign")
    this.compaignsService.stopWhatsappBusinessCampaign(element.id,this.compaignsService.email).subscribe(
      (res)=>{
        this.getCompaigns();

      },
      (err)=>{

      }
    )
  }
  test(element){
    console.log("test")
  }
}

