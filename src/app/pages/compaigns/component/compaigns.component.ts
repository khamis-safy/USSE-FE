import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { CompaignsService } from '../compaigns.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-compaigns',
  templateUrl: './compaigns.component.html',
  styleUrls: ['./compaigns.component.scss']
})
export class CompaignsComponent implements AfterViewInit ,OnInit {

  length:number=0;
  loading:boolean=false;

  isCompagins:boolean=true;

  columns :FormControl;
  displayed: string[] = ['Name', 'Status', 'Creator Name', 'Start Date'];
  displayedColumns: string[] = ['Name', 'Status', 'Creator Name', 'Start Date','Action'];
  dataSource:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private compaignsService:CompaignsService, private router:Router){}


  ngOnInit() {
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

  compaignDetails(com){
    this.router.navigateByUrl(`compaign`)
  }
}

