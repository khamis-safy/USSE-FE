import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ManageContactsService } from '../../../manage-contacts.service';
import { AddContactComponent } from '../addContact/addContact.component';
import { MatTableDataSource } from '@angular/material/table';
import { ListData } from '../../../list-data';
import { MatSort, Sort } from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Contacts } from '../../../contacts';

interface CheckedCont{
  list:string[],
  contacts:Contacts[],
  listDetails:boolean

}
@Component({
  selector: 'app-contactLists',
  templateUrl: './contactLists.component.html',
  styleUrls: ['./contactLists.component.scss']
})
export class ContactListsComponent implements OnInit ,AfterViewInit {
  isLoading = false;
  numRows;
  dataSource:MatTableDataSource<ListData|Contacts>;
  @ViewChild(MatSort) sort=new MatSort;

  displayedColumns: string[] = ['select', 'name', "totalContacts"];
  listTableData:ListData[]=[];

  listIds:string[]=[];
  contactsIds:string[];
  selection = new SelectionModel<any>(true, []);

  constructor(
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CheckedCont,
  ) { }


  ngAfterViewInit() {
  }
  ngOnInit() {
    console.log("from contactlists",this.data)
    this.contactsIds=this.data.contacts.map(res=>res.id);

    console.log("contacts ids",this.contactsIds)

    // get selected data from table
    this.selection.changed.subscribe(
      (res) => {

        if(res.source.selected.length){
          console.log("selected",res.source.selected);
          if(this.data.listDetails){
            this.contactsIds=res.source.selected.map((e)=>e.id);
            console.log("selected contactes",this.contactsIds)
          }
          else{
            this.listIds=res.source.selected.map((e)=>e.id);
          }

          console.log("list ids",this.listIds)
        }
        else{
          if(this.data.listDetails){
            this.contactsIds=[];

          }
          else{
            this.listIds=[];
          }
        }
      });

    // if this component is opened from ListDetailsComponent
      if(this.data.listDetails)
      {
        this.displayedColumns= ['select', 'name'];
        this.getContactsData();
        this.listIds=this.data.list;
      }

      else
      {
        this.displayedColumns= ['select', 'name', "totalContacts"];

      this.getListData();
    }

      }

getListData(){
  let shows=100;
  let pageNum=this.listService.pageNum;
  let email=this.listService.email;
  let orderedBy="";
  let search="";
  this.listService.getList(email,shows,pageNum,orderedBy,search).subscribe(
      (res)=>{
        console.log(res);
        this.numRows=res.length;
        console.log("num of rows",this.numRows)
  this.dataSource=new MatTableDataSource<ListData>(res)
console.log("from get api",this.dataSource)
      },
      (err)=>{
        console.log(err);
      })
}
getContactsData(){
  let shows=50;
  let pageNum=this.listService.pageNum;
  let email=this.listService.email;
  let orderedBy="";
  let search="";

    let sub1= this.listService.getContacts(email,false,shows,pageNum,orderedBy,search,"").subscribe(
      (res)=>{
        const filterdContacts = res.filter((obj) => !this.contactsIds.includes(obj.id));
        this.contactsIds=filterdContacts.map((e)=>e.id);

        console.log("filterd ids",this.contactsIds)
        console.log(res);
        if(this.data.listDetails){
          this.numRows=this.contactsIds.length;

        }
        else{
          this.numRows=res.length;

        }
        console.log("num of rows",this.numRows)
  this.dataSource=new MatTableDataSource<Contacts>(filterdContacts)
console.log("from get api",this.dataSource)
      },
      (err)=>{
        console.log(err);
      })
}
  onClose(data?): void {

    this.dialogRef.close(data);
    console.log("onClose",data)

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;

    const numRows =  this.numRows;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  onSortChange(e) {
    this.dataSource.sort=this.sort

  }

  submitAdd(){
    this.isLoading = true
    let email="khamis.safy@gmail.com";
    this.listService.addOrMoveContacts(this.contactsIds,this.listIds).subscribe(
      (res)=>{
        this.isLoading = false
        console.log(res)
        this.onClose(true);
        this.toaster.success(`${res.numberOfSuccess} Added Successfully ${res.numberOfErrors} failed`)
                  },
      (err)=>{
        this.isLoading = false
        console.log(err)
        this.onClose(false);
        this.toaster.error("Error")
            }
    )
  }
}
