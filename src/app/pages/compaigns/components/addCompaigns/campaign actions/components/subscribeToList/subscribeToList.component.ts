import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-subscribeToList',
  templateUrl: './subscribeToList.component.html',
  styleUrls: ['./subscribeToList.component.scss']
})
export class SubscribeToListComponent implements OnInit {
  isLoading:boolean;
  isDisabled: any;
  criterias:any=[];
  loading:boolean;
  listId:string;
  listsArr:SelectOption[]
  listsLoadingText:string='Loading ...';
  addNewList:boolean=false;
  selectedLists:any = new FormControl([]);
  listName = new FormControl('',Validators.required);
  addedList:ListData;
  form = new FormGroup({
    selectedLists:this.selectedLists,
    listName:this.listName

  });
  allLists:any=[];
  constructor(public dialogRef: MatDialogRef<SubscribeToListComponent>,
     @Inject(MAT_DIALOG_DATA) public data:any,
     private listService:ManageContactsService,
     private translate: TranslateService,
     private authService:AuthService,
     private toaster: ToasterServices) { }

  ngOnInit() {
    if(this.data){
      this.criterias = this.data.criterias;

    }
    this.getLists();
  }
  isButtonDisabled(ev){
    this.isDisabled=ev;
  }
  setCriterias(event){
    this.criterias=event;
    }
  onClose(data?){
    this.dialogRef.close(data);
  }
 
 

  
  getLists(lisname?:string){
    this.listService.getList(this.authService.getUserInfo()?.email,100,0,"","").subscribe(
       (res)=>{
        this.allLists=res;
        this.listsArr = res.map(res=>{
          return {
            title:res.name,
            value:res.id
          }
        })
        if(res.length==0){
          this.listsLoadingText='No Results'
        }
         if(res.length!=0 && lisname){
          this.addedList=this.allLists.find((listData)=>listData.name==lisname);
          this.form.patchValue({
            selectedLists: {
              title:this.addedList?.name,
              value:this.addedList?.id
            }
          });
          this.listId=this.addedList.id
        }
        else if(res.length!=0 && this.data){
          this.addedList=this.allLists.find((listData)=>listData.id==this.data.listId);
          this.form.patchValue({
            selectedLists: {
              title:this.addedList?.name,
              value:this.addedList?.id
            }
          });
          this.listId=this.addedList.id
        }

        },
        (err)=>{
          this.listsLoadingText='No Results'
          // this.onClose(false);
          // this.toaster.error("Error")

        })
    }
  submitAddList(){
    this.isLoading = true

    this.listService.addList(this.form.value.listName,this.authService.getUserInfo()?.email).subscribe(
      (res)=>{
        this.isLoading = false;

        this.addNewList=false;
                this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));

        this.getLists(this.form.value.listName)
      },
      (err)=>{
        this.addNewList=false;

        this.isLoading = false
      }
    )

  }
  onSelect(event){
    this.listId=event.value
  }
  submit(){
    this.isLoading=true;
    this.onClose({
      criterias:this.criterias,
      listId: this.listId
    })

  }
}
