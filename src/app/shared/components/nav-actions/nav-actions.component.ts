import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { AuthService } from '../../services/auth.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { ToasterServices } from '../us-toaster/us-toaster.component';
import { Subscription } from 'rxjs';
import { UnCancelContactsComponent } from 'src/app/pages/manage-contacts/components/contacts/unCancelContacts/unCancelContacts.component';
import { ContactListsComponent } from 'src/app/pages/manage-contacts/components/contacts/contactLists/contactLists.component';

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
  openedDialogs:any=[];
  showExportOptions:boolean=false;
  menuItems: { name: string; function?: () => void ,submenu?:any }[] ;
  constructor(public dialog: MatDialog,
    private  toaster: ToasterServices,
    private listService:ManageContactsService,
    private authService:AuthService,
    private translate:TranslateService,) { }
 
  ngOnInit() {
    if(this.componentName=='contacts'){
     this.showContactsMenueItems()
    }
    if(this.componentName=='canceledContacts'){
      this.showCanceledContactsMenueItems()

    }
    if(this.componentName=='lists'){
      this.showListsMenueItems()

    }
  }
  showListsMenueItems(){
    this.menuItems = [
      { name: 'Select_All', function: () => this.selectAll() },
      { name: 'delete', function: () => this.openDeleteModal()}
    ];
  }
  showCanceledContactsMenueItems(){
    this.menuItems=[
      {name: 'UnCancel', function: () => this.openUnCancelContactsModal()}]
  }
  showContactsMenueItems(){
    this.menuItems = [
      { name: 'Select_All', function: () => this.selectAll() },
      { name: 'Remove_Lists', function: () => this.removeLists() },
      { name: 'delete', function: () => this.openDeleteModal()},
      { name: 'ADD_TO_LISTS', function: () => this.addContactToList()},
      { name: 'EXPORT_SELECTED'}
    ];

  }
  exportSelectedContactsAs(fileType){
    let exporedContacts=this.selectedItems.map((contact)=>{
      return{
        name: contact.name,
        mobileNumber: contact.mobileNumber,
   
      }
    })
    this.listService.exportSelectedContacts(exporedContacts,fileType).subscribe(
      (res)=>{
        this.listService.exportFileData(res,fileType);
        this.deselectAllEvent.emit(true)
      },
      (err)=>{
      }
    )
  }
  selectAll(){
    this.selectAllEvent.emit(true)
    if(this.componentName== 'contacts'){
      this.menuItems=[
        { name: 'Remove_Lists', function: () => this.removeLists() },
        {name: 'delete', function: () => this.openDeleteModal()},
        { name: 'ADD_TO_LISTS', function: () => this.addContactToList()},
        { name: 'EXPORT_SELECTED'}]
        
    }
    if(this.componentName== 'lists')
    {
      this.menuItems=[
        {name: 'delete', function: () => this.openDeleteModal()}]
    }
  }

addContactToList(){
  const dialogConfig=new MatDialogConfig();
  dialogConfig.height='75vh';
  dialogConfig.width='100%';
  dialogConfig.maxWidth='100%';
  dialogConfig.minWidth='100%';
  dialogConfig.maxHeight='85vh';
  dialogConfig.minHeight='470px'
  dialogConfig.disableClose = true;
  dialogConfig.panelClass = 'custom-mat-dialog-container';

  dialogConfig.data = {contacts:this.selectedItems , listDetails:false};
  const dialogRef = this.dialog.open(ContactListsComponent,dialogConfig);


    let sub1=  dialogRef.afterClosed().subscribe(result => {
      if(result){
        
        this.updateData.emit(true)

      }


    });
    this.subscriptions.push(sub1)
    this.openedDialogs.push(dialogRef)
    // dialogRef.afterClosed().subscribe(result => {
    // if(result){
    //   if(result == 'noErrors'){
    //     this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));
    //     this.contacts.getContacts();
    //   }
    //   else{
    //     this.openRequestStateModal(result ,'addContactsToLists');
    //   }

    // }
    // this.contacts.selection.clear();

  
// });
}
  openDeleteModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='60vh';
    dialogConfig.width='100vw';
    dialogConfig.minHeight='428';
    dialogConfig.maxWidth='100vw';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    if(this.componentName== 'contacts')
    {
      dialogConfig.data =
      {
        contactsData: {contacts:this.selectedItems,remove:false}
      }
    }
    if(this.componentName== 'lists')
    {
      dialogConfig.data = {
        listsData:{lists:this.selectedItems}
      };
    }   


    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);


  let sub1=  dialogRef.afterClosed().subscribe(result => {
      if(result){
        
        this.updateData.emit(true)

      }


    });
    this.subscriptions.push(sub1)
    this.openedDialogs.push(dialogRef)

   
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
    this.openedDialogs.push(dialogRef)

  }
  openUnCancelContactsModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='75vh';
    dialogConfig.width='100%';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='100%';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    dialogConfig.data =
    {
      contactsData: {contacts:this.selectedItems}
    }


    const dialogRef = this.dialog.open(UnCancelContactsComponent,dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.updateData.emit(true)

        // this.contacts.canceledContacts=result.data;
        // if(result.errors == 'noErrors'){
        //   this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));
        //   this.contacts.getContacts("" ,true);
          
        //   this.contacts.unCancelSnackBar();
        // }
        // else{
        //   this.openRequestStateModal(result ,'unCancelContacts');
        // }

     

      }

      // this.contacts.selection.clear();

    });
    this.openedDialogs.push(dialogRef)

  }
  onClose(){
    this.deselectAllEvent.emit(true)
  }
  ngOnDestroy() {
    this.openedDialogs.forEach((dialog)=>{
      if(dialog){
        dialog.close();
      }
    })
  this.subscriptions.map((sub)=>sub.unsubscribe())
  }
}
