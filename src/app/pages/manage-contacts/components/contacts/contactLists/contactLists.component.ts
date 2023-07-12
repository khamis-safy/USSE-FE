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

@Component({
  selector: 'app-contactLists',
  templateUrl: './contactLists.component.html',
  styleUrls: ['./contactLists.component.scss']
})
export class ContactListsComponent implements OnInit ,AfterViewInit {
  dataSource:MatTableDataSource<ListData>;
  @ViewChild(MatSort) sort=new MatSort;
  isLoading = false;
  listTableData:ListData[]=[];
  numRows;
  displayedColumns: string[] = ['select', 'name', "totalContacts"];
  listIds:string[]=[];
  contactsIds:string[];
  // dataSource = new MatTableDataSource<any>(this.listTableData);
  selection = new SelectionModel<any>(true, []);
  constructor(
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data:  Contacts[],
    private _liveAnnouncer: LiveAnnouncer
  ) { }


  ngAfterViewInit() {
  }
  ngOnInit() {
    console.log("from contactlists",this.data)
    this.contactsIds=this.data.map(res=>res.id)
    console.log("contacts ids",this.contactsIds)
    this.selection.changed.subscribe(
      (res) => {

        if(res.source.selected.length){
          console.log("selected",res.source.selected);
          this.listIds=res.source.selected.map((e)=>e.id);
          console.log("list ids",this.listIds)
        }
        else{
          this.listIds=[]
        }
      });

this.getListData();
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

  // openSnackBar() {
  //   this._snackBar.open("hello","button", {
  //     duration: 4000,
  //   });



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

    // this.listService.addContact(name,mobile,cnNName,note,email,this.listsIds).subscribe(
      // (res)=>{
      //   this.isLoading = false
      //   console.log(res)
      //   this.onClose(true);
      //   this.toaster.success("Success")
      //             },
      // (err)=>{
      //   this.isLoading = false
      //   console.log(err)
      //   this.onClose(false);
      //   this.toaster.error("Error")
      //       }
    // )
  }
}
