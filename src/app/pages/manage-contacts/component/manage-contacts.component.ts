import { DeleteListComponent } from './../components/lists/delete-list/delete-list.component';
import { ToasterServices } from './../../../shared/components/us-toaster/us-toaster.component';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddListComponent } from '../components/lists/addList/addList.component';
import { ListsComponent } from '../components/lists/lists.component';

@Component({
  selector: 'app-manage-contacts',
  templateUrl: './manage-contacts.component.html',
  styleUrls: ['./manage-contacts.component.scss'],

})
export class ManageContactsComponent {
  added:boolean=false;
  isDelete;
  @ViewChild(ListsComponent) lists:ListsComponent;
  constructor(public dialog: MatDialog,private  toaster: ToasterServices){

  }
  test(){
    this.toaster.warning('hello')
  }
  openModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='85vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    const dialogRef = this.dialog.open(AddListComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.lists.getListsCount();
      this.lists.getListData();
    });
  }
  onDeleteChange(e){
    this.isDelete = e;
    console.log("onDeleteChange",e)
  }
  openDeleteModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data = this.isDelete;
    const dialogRef = this.dialog.open(DeleteListComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.lists.getListsCount();
      this.lists.getListData();
      this.lists.selection.clear();
      console.log("delete afterClosed",this.lists.selection)

    });
  }

}
