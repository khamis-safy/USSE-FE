import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { TemplatesService } from '../../templates.service';
import {AddTemplateComponent} from '../addTemplate/addTemplate.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';

import { Subscription } from 'rxjs';
import { Templates } from '../../templates';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TEMPLATESHEADERS } from '../constats/contstants';

@Component({
  selector: 'app-innerTemplates',
  templateUrl: './innerTemplates.component.html',
  styleUrls: ['./innerTemplates.component.scss'],
})
export class InnerTemplatesComponent implements OnInit {
  length: number;
  delay: number = 5;
  active: boolean = false;
  numRows;
  loading:boolean=true;
  isSearch:boolean=false;

    noData: boolean=true;
    notFound: boolean=false;
  @Input() isCanceled: boolean;
  @Input() canEdit: boolean;

  subscribtions:Subscription[]=[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('search') search!: ElementRef;

  deletedContacts: string[] = [];
  columns: FormControl;
  displayed: string[] = TEMPLATESHEADERS;
  displayedColumns: string[] = [
    'Template Name',
    'Message',
    'Created At',
    'Action',
  ];
  dataSource: MatTableDataSource<Templates>;
  constructor(
    public dialog: MatDialog,
    private toaster: ToasterServices,
    private templatesService: TemplatesService
  ) {}

  @Input('isUnsubscribe') isUnsubscribe = false;

  ngOnInit() {
    this.getTemplates();
    this.columns = new FormControl(this.displayedColumns);
    this.displayedColumns=this.canEdit?[
      'Template Name',
      'Message',
      'Created At',
      'Action',
    ]: ['Template Name', 'Message', 'Created At'];

  }


  openDeleteModal(id:string){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.data =
    {
      templatesData:{templatesId:id}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getTemplates();
      }
    });
  }





  openEditModal(data?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='77vh';
    dialogConfig.width='40vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.maxHeight='85vh';
    dialogConfig.disableClose = true;

    dialogConfig.data=data ;

    const dialogRef = this.dialog.open(AddTemplateComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getTemplates();
            }
    });

  }


  getTemplates(searchVal?){
        let showsNum=this.templatesService.showsNum;
        let pageNum=searchVal?0 :this.templatesService.pageNum;
        let email=this.templatesService.email;
        let orderedBy=this.templatesService.orderedBy;
        let search=searchVal?searchVal:"";
        let isCanceled=this.isUnsubscribe;
        this.loading = true;
        if(searchVal && this.paginator){
          this.paginator.pageIndex=0
        }
         let sub1= this.templatesService.getTemplates(email,showsNum,pageNum,orderedBy,search).subscribe(
            (res)=>{
              this.numRows=res.length;
          
              this.dataSource=new MatTableDataSource<Templates>(res)
            
              if(this.isCanceled){
                this.displayedColumns= ['Template Name', 'Message', "Create At" , 'Action'];

              }
              if(search!=""){
                this.length=res.length;
                if(this.length==0){
                  this.notFound=true;
                }
                else{
                  this.notFound=false;
                }
            } 
            else{
              this.paginator.pageIndex=this.templatesService.pageNum
              this.notFound=false;
              this.templatesCount();
              this.isSearch=false;
            }
             

             },
             (err)=>{
               this.length=0;
               this.noData=true
               this.loading = false;

             })
             this.subscribtions.push(sub1)
        }




        templatesCount(){
          let email=this.templatesService.email;
          this.loading = true;

          this.templatesService.listTemplatesCount(email).subscribe(
            (res)=>{

              this.length=res;
              if(this.length==0){
                this.noData=true
                this.loading = false;

              }
              else{
                this.noData=false
              }
              this.loading = false;

            }
            ,(err)=>{
              this.noData=true

              this.length=0;
              this.loading = false;

            }
           );
        }




     onSearch(event: any) {

    this.getTemplates( event.value);
  }



  changeColumns(event) {
    if(this.canEdit){
      this.displayedColumns = [ ...event, 'Action'];

    }
    else{
      this.displayedColumns = [ ...event];

    }
  }


  onPageChange(event){
    this.templatesService.showsNum=event.pageSize;
    this.templatesService.pageNum=event.pageIndex;


    this.getTemplates();

  }

}
