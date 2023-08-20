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
  loading;

  @Input() isCanceled: boolean;

  subscribtions:Subscription[]=[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('search') search!: ElementRef;

  deletedContacts: string[] = [];
  columns: FormControl;
  displayed: string[] = ['Template Name', 'Message', 'Created At'];
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
  }


  openDeleteModal(id:string){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
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
    dialogConfig.minWidth='300px';
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


  getTemplates(){
        let showsNum=this.templatesService.showsNum;
        let pageNum=this.templatesService.pageNum;
        let email=this.templatesService.email;
        let orderedBy=this.templatesService.orderedBy;
        let search=this.templatesService.search;
        let isCanceled=this.isUnsubscribe;
        this.loading = true;

         let sub1= this.templatesService.getTemplates(email,showsNum,pageNum,orderedBy,search).subscribe(
            (res)=>{
              this.numRows=res.length;
              console.log(res);
              this.loading = false;
              if(this.isCanceled){
                this.displayedColumns= ['Template Name', 'Message', "Create At" , 'Action'];

              }

              this.dataSource=new MatTableDataSource<Templates>(res)

             },
             (err)=>{
              this.loading = false;
              this.length=0;

             })
             this.subscribtions.push(sub1)
        }









     onSearch(event: any) {
    this.templatesService.search = event.value;

    this.getTemplates();
  }



  changeColumns(event) {
    this.displayedColumns = [ ...event, 'Action'];
  }


  onPageChange(event){
    this.templatesService.showsNum=event.pageSize;
    this.templatesService.pageNum=event.pageIndex;


    this.getTemplates();

  }

}
