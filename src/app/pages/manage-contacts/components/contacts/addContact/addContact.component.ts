import { AfterViewInit, Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ListData } from '../../../list-data';
import { ManageContactsService } from '../../../manage-contacts.service';
import { AddListComponent } from '../../lists/addList/addList.component';
import { Contacts } from '../../../contacts';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PluginsService } from 'src/app/services/plugins.service';
import { AuthService } from 'src/app/shared/services/auth.service';

interface CheckedCont{
  contacts:Contacts,
  listDetails:boolean,
  list:ListData

}
@Component({
  selector: 'app-addContact',
  templateUrl: './addContact.component.html',
  styleUrls: ['./addContact.component.scss']
})
export class AddContactComponent implements OnInit,OnDestroy{
// isChanged:boolean=false;
listsLoadingText:string='Loading ...';
email:string=this.authService.getUserInfo()?.email;
  // lists: ListData[] ;
  listsArr:SelectOption[]
  // ngx-intl-tel
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  isLoading = false;

  selectedLists = new FormControl([]);
  name:any = new FormControl('',[Validators.required,Validators.pattern(this.plugin.notStartWithSpaceReg)]);
  mobile:any = new FormControl('',[Validators.required]);
  cnName:any = new FormControl('');
  note:any=new FormControl('');
  fieldName:any=new FormControl('',[Validators.required]);
  value:any=new FormControl('',[Validators.required]);

  form = new FormGroup({
    name:this.name,
    mobile:this.mobile,
    cnName:this.cnName,
    note:this.note,
    selectedLists:this.selectedLists,


  });
  form2 = new FormGroup({
    fieldName:this.fieldName,
    value:this.value

  });
  isEdit:boolean =false

oldData;
invalidName:boolean;
additionalParameters:{name:string, value:string}[]=[];
cachedFields:{name:string, value:string}[]=[];

subscribe:Subscription;
showInputs:boolean=false;
  // listsIds:string[]=[""];
  constructor(
    private plugin:PluginsService,
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<AddContactComponent>,
    private authService:AuthService,
    private translate: TranslateService,

    @Inject(MAT_DIALOG_DATA) public data:CheckedCont,
  ) {
  }


  ngOnInit() { 
    this.subscribe= this.form2.valueChanges.subscribe(()=>{
      this.invalidName=this.checkIfFieldFound(this.form2.value.fieldName)

    })
    this.getLists();
    if(this.data){

      this.isEdit = true
      this.fillingData();
      // this.listsIds=this.data.lists.map((e)=>e.id)
      // this.listsIds=this.data.contacts.lists.map((e)=>e.id);

      this.selectedLists=new FormControl(this.data.contacts.lists)


    }else{
      this.isEdit = false;
    }
  }

  // ngx-intl-tel
  // changePreferredCountries() {
	// 	this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	// }

  fillingData(){
    this.form.patchValue({
      name: this.data.contacts.name,
      mobile:`+${this.data.contacts.mobileNumber}`,
      cnName:this.data.contacts.companyName,
      note:this.data.contacts.note,
    });
    this.additionalParameters=this.data.contacts.additionalContactParameter;


  }
checkIfFieldFound(name){
  let found= this.additionalParameters.find((param)=>param.name==name)
  return found? true: false

}
  getLists(){
  this.listService.getList(this.email,100,0,"","").subscribe(
     (res)=>{
      if(this.data){
        let dataLists;
        let lists=[];
        if(this.data.listDetails){

          lists.push(this.data.list);
          dataLists=lists;
        }
        else{
          dataLists=this.data.contacts.lists;
        }


      let resList=res
      const listsMap = new Map();

      dataLists.forEach(list => listsMap.set(list.id, list));

      resList.forEach(list => {
        const exists = listsMap.has(list.id);

        if (!exists) {
          listsMap.set(list.id, list);
        }
      })
      let allLists=[]
      listsMap.forEach(list => allLists.push(list));
      // this.lists=allLists
      this.listsArr = allLists.map(res=>{
        return {
          title:res.name,
          value:res.id
        }
      })
      if(this.data.listDetails){
        this.form.patchValue({
          selectedLists: lists.map(res=>{
            return {
              title:res.name,
              value:res.id
            }
          })
        })
      }
      else{
        this.form.patchValue({
          selectedLists: this.data.contacts?.lists.map(res=>{
            return {
              title:res.name,
              value:res.id
            }
          })
        })
      }


      }
      else{
        // this.lists=res;
        this.listsArr = res.map(res=>{
          return {
            title:res.name,
            value:res.id
          }
        })
      }
      if(res.length==0){
        this.listsLoadingText='No Results'
      }
      },
      (err)=>{
        // this.onClose(false);
        // this.toaster.error("Error")

      })
  }
  remove(i){
    this.cachedFields.push(this.additionalParameters[i]);
    this.additionalParameters.splice(i,1);
  }
  save(){
    this.showInputs=false;

    this.additionalParameters.push({name:this.form2.value.fieldName,value:this.form2.value.value})
    this.form2.patchValue({
      fieldName:"",
      value:""
    })
  }
  cancel(){
    
    this.showInputs=false;
    this.form2.patchValue({
      fieldName:"",
      value:""
    })

  }
  submitAdd(){
    this.isLoading = true
    let email=this.email;
    let name =this.form.value.name;
    let cnNName=this.form.value.cnName;
    let mobile=this.form.value.mobile.e164Number;
    let note = this.form.value.note;
    let listsIds = this.form.value.selectedLists.map((e)=>e.value);

    this.listService.addContact(name,mobile,cnNName,note,email,listsIds,this.additionalParameters).subscribe(
      (res)=>{
        this.isLoading = false
        this.onClose(true);
        this.toaster.success( this.translate.instant("COMMON.SUCC_ADD"));
      },
      (err)=>{
        this.isLoading = false
        this.onClose(false);
        // this.toaster.error( this.translate.instant("COMMON.ERR"))
      }
    )

  }


  submitEdit(){
    let listsIds = this.form.value.selectedLists.map((e)=>e.value);

    let data:any={
      id:this.data.contacts.id,
      name :this.form.value.name,
      mobileNumber:this.form.value.mobile.e164Number,
      companyName:this.form.value.cnName || "",
      note: this.form.value.note || "",
      email: this.email,
      newListId:listsIds,
      additionalContactParameters: this.additionalParameters

    }

    this.isLoading = true
    if(this.data.listDetails){
      this.listService.updateContact(data).subscribe(

        (res)=>{
          this.isLoading = false
          this.onClose(true);
                  this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));

        },
        (err)=>{
          this.isLoading = false
          this.onClose(false);
        }
      )
    }
    else{
      data={
        id:this.data.contacts.id,
        name :this.form.value.name,
        mobileNumber:this.form.value.mobile.e164Number,
        companyName:this.form.value.cnName || "",
        note: this.form.value.note || "",
        email: this.email,
        newListId:listsIds,
        additionalContactParameters: this.additionalParameters
      }

      this.listService.updateContact(data).subscribe(

        (res)=>{
          this.isLoading = false
          this.onClose(true);
                  this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));

        },
        (err)=>{
          this.isLoading = false
          this.onClose(false);
        }
      )
    }

  }
  onClose(data?):void {
    if(this.cachedFields.length>0){
      this.cachedFields.map((field)=>this.additionalParameters.push(field))
    }
    this.dialogRef.close(data);
  }
  changeLists(event){

    // this.listsIds=event.map((e)=>e.id)
  }
  ngOnDestroy() {
    this.subscribe.unsubscribe()
  }
}
