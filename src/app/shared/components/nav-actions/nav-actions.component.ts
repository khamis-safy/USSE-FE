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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorsStatesComponent } from '../bulkOperationModals/errorsStates/errorsStates.component';
import { RequestStateComponent } from '../bulkOperationModals/requestState/requestState.component';

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
  @Output() updateCanceledData = new EventEmitter<boolean>();
  @Output() unDoDeleteItem = new EventEmitter<boolean>();
  @Output() resendFailedMessages = new EventEmitter<boolean>();

  openedDialogs:any=[];
  showExportOptions:boolean=false;
  deletedItems:any=[];
  canceledContacts:any=[];
  menuItems: { name: string; function?: () => void ,submenu?:any }[] ;
  constructor(public dialog: MatDialog,
    private  toaster: ToasterServices,
    private listService:ManageContactsService,
    private authService:AuthService,
    private translate:TranslateService,
    private snackBar: MatSnackBar) { }
    
 
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
    if(this.componentName=='failed'){
      this.showFailedMsgMenueItems()
    }
    else{
      this.showMessageMenueItems()

    }
  }
  showFailedMsgMenueItems(){
    this.menuItems = [
      { name: 'Select_All', function: () => this.selectAll() },
      { name: 'Resend Selected Items', function: () => this.resendMessages() },
      { name: 'delete', function: () => this.openDeleteMessageModal()}
    ];
  }
  showMessageMenueItems(){
    this.menuItems = [
      { name: 'Select_All', function: () => this.selectAll() },
      { name: 'delete', function: () => this.openDeleteMessageModal()}
    ];
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
  resendMessages(){
    this.resendFailedMessages.emit(true)
  }
  openDeleteMessageModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='54vh';
    dialogConfig.width='100vw';
    dialogConfig.minHeight='428';
    dialogConfig.maxWidth='100vw';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    dialogConfig.data =
    {
      messagesData:{messages:this.selectedItems}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.updateData.emit(true);
      }


    });
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
    if(this.componentName=='failed')
    {
      this.menuItems = [
        { name: 'Resend Selected Items', function: () => this.resendMessages() },
        { name: 'delete', function: () => this.openDeleteMessageModal()}
      ];
    }
    else{
      this.menuItems = [
        { name: 'delete', function: () => this.openDeleteMessageModal()}
      ];
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
        if(result == 'noErrors'){
          this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));
          this.updateData.emit(true)
        }
        else{
          this.openRequestStateModal(result ,'addContactsToLists');
        }
        

      }


    });
    this.subscriptions.push(sub1)
    this.openedDialogs.push(dialogRef)

}
  openDeleteModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='54vh';
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
    
        this.deletedItems=result.data;
        if(result.errors == 'noErrors'){
          this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));
          this.unDoDeleteItem.emit(true)
          
    
        }
        else{
          this.openRequestStateModal(result ,'deleteContact');
        }
    

      }


    });
    this.subscriptions.push(sub1)
    this.openedDialogs.push(dialogRef)

  }

  openRequestStateModal(data , operation){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='38vh';
    dialogConfig.width='42vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.minHeight='396px'
    dialogConfig.disableClose = true;
    dialogConfig.data=data;
  
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    const dialogRef = this.dialog.open(RequestStateComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.openErrorsViewrModal(data , operation)
          }
          else{
            if(operation ==  'addContactsToLists' || operation ==  'removeLists'){
              this.updateData.emit(true)
            }
        
            if(operation == 'deleteContact' || operation == 'deleteList')
            {
              this.unDoDeleteItem.emit(true)
            }
          
            if(operation == 'unCancelContacts'){
              this.updateCanceledData.emit(true)
              
        }
  
          }
      })
  
  }
openErrorsViewrModal(result , operation){
  const dialogConfig=new MatDialogConfig();
  dialogConfig.height='87vh';
  dialogConfig.minHeight='560px'
  dialogConfig.width='56vw';
  dialogConfig.maxWidth='100%';
  dialogConfig.minWidth='565px';
  dialogConfig.disableClose = true;
  dialogConfig.data=result

  const dialogRef = this.dialog.open(ErrorsStatesComponent,dialogConfig);
  dialogRef.afterClosed().subscribe(result => {
    if(operation ==  'addContactsToLists' || operation ==  'removeLists'){
          this.updateData.emit(true)
    }

    if(operation == 'deleteContact' || operation == 'deleteList')
    {
      this.unDoDeleteItem.emit(true)
    }
   
    if(operation == 'unCancelContacts'){
      this.updateCanceledData.emit(true)
      
    }
  })
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
        if(result == 'noErrors'){
          this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));
          this.updateData.emit(true)
        }
        else{
          this.openRequestStateModal(result ,'removeLists');
        }
      }


    });
    this.openedDialogs.push(dialogRef)

  }
  openUnCancelContactsModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='39vh';
    dialogConfig.width='100vw';
    dialogConfig.minHeight='428';
    dialogConfig.maxWidth='100vw';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    dialogConfig.data =
    {
      contactsData: {contacts:this.selectedItems}
    }
    const dialogRef = this.dialog.open(UnCancelContactsComponent,dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.canceledContacts=result.data;
        if(result.errors == 'noErrors'){
          this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));
          this.updateCanceledData.emit(true)
                  }
        else{
          this.openRequestStateModal(result ,'unCancelContacts');
        }
      }
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
