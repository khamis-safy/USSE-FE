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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';

import{Templates} from '../../templates' ;
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DeleteContactComponent } from '../../../manage-contacts/components/contacts/deleteContact/deleteContact.component';

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

  ngOnInit() {
    this.getTemplates();
    this.columns = new FormControl(this.displayedColumns);
  }

  getTemplates() {
    let shows = this.templatesService.display;
    let pageNum = this.templatesService.pageNum;
    let email = this.templatesService.email;
    let orderedBy = this.templatesService.orderedBy;
    let search = this.templatesService.search;
    this.loading = true;
    this.templatesService
      .getTemplates('khamis.safy@gmail.com' , 10 , 0 , '' , '')
      .subscribe(
        (res) => {

          this.numRows=res.length;

          this.loading = false;
          this.dataSource=new MatTableDataSource<Templates>(res)
        },
        (err) => {
          this.loading = false;
          this.length=0;
        }
      );
  }

  onSearch(event:any){
    this.templatesService.search=event.value;


    this.getTemplates();
  }
  changeColumns(event){
      this.displayedColumns=['select',...event,'action']
  }

}
