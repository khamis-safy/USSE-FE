import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { AuthService } from '../../services/auth.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { ToasterServices } from '../us-toaster/us-toaster.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-actions',
  templateUrl: './nav-actions.component.html',
  styleUrls: ['./nav-actions.component.scss']
})
export class NavActionsComponent implements OnInit ,OnDestroy{
  selectedItemsCount: number = 0;
  selectedItems:any=[];
  componentName:string;
  subscriptions:Subscription[]=[];
  isAllChecked:boolean;
  @Output() selectAllEvent = new EventEmitter<boolean>();
  @Output() deselectAllEvent = new EventEmitter<boolean>();
  @Output() updateData = new EventEmitter<boolean>(); 

  menuItems: { name: string; function: () => void }[] ;
  constructor(public dialog: MatDialog,
    private  toaster: ToasterServices,
    private listService:ManageContactsService,
    private authService:AuthService,
    private translate:TranslateService,) { }
 
 
  ngOnInit() {
    if(this.componentName=='contacts'){
     this.showContactsMenueItems()
    }
    
  }
  showContactsMenueItems(){
    this.menuItems = [
      { name: 'Select_All', function: () => this.selectAll() },
      { name: 'Remove_Lists', function: () => this.removeLists() },
      { name: 'delete', function: () => this.openDeleteModal()}
    ];
  }
  selectAll(){
    this.selectAllEvent.emit(true)
    this.menuItems=[
      { name: 'Remove_Lists', function: () => this.removeLists() },
      {name: 'delete', function: () => this.deleteAll()}]
  }

  deleteAll(){
    if(this.componentName== 'contacts')
    {
      this.openDeleteConModal();
    }
  }
  openDeleteModal(){
    if(this.componentName== 'contacts')
    {
      this.openDeleteConModal();
    }
  }
  openDeleteConModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='60vh';
    dialogConfig.width='100vw';
    dialogConfig.minHeight='428';
    dialogConfig.maxWidth='100vw';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';

    dialogConfig.data =
    {
      contactsData: {contacts:this.selectedItems,remove:false}
    }


    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);


  let sub1=  dialogRef.afterClosed().subscribe(result => {
      if(result){
        
        this.updateData.emit(true)

      }


    });
    this.subscriptions.push(sub1)
  }

  removeLists(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='60vh';
    dialogConfig.width='100vw';
    dialogConfig.minHeight='428';
    dialogConfig.maxWidth='100vw';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    dialogConfig.data =
    {
      contactsData:{contacts:this.selectedItems,remove:true}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);

    let sub2=   dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.updateData.emit(true)

      }


    });
  }
  onClose(){
    this.deselectAllEvent.emit(true)
  }
  ngOnDestroy() {
  this.subscriptions.map((sub)=>sub.unsubscribe())
  }
}
