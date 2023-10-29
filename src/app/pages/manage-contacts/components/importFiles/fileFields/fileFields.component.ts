import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManageContactsService } from '../../../manage-contacts.service';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

interface FilesData{
  columnName:string,
  columnIndex:number,
  swichOpened:boolean,
  contactsData:{title:string,value:number}[],
  selected:{title:string,value:number},
  form:FormGroup

}
@Component({
  selector: 'app-fileFields',
  templateUrl: './fileFields.component.html',
  styleUrls: ['./fileFields.component.scss']
})
export class FileFieldsComponent implements OnInit {
  fileHeaders:string[];
  contactsData:string[]=['Contact Name', 'Mobile Number', 'Company Name', 'Note']
  selectedHeaders:string[]=[];
  rowsData:FilesData[]=[];
  valid:boolean;
  loading:boolean;
  constructor(    @Inject(MAT_DIALOG_DATA) public data:any,
  private listService: ManageContactsService,
  public dialogRef: MatDialogRef<FileFieldsComponent>,
  private toaster: ToasterServices,
      private authService:AuthService,
      private translate:TranslateService
  ) { }

  ngOnInit() {
    if(this.data){
      this.fileHeaders=this.data.rowData;
      this.rowsData=this.fileHeaders.map((header)=>{
        const form = new FormGroup({
          contacts: new FormControl({value:null,  disabled: false}),
        });
        return{
          columnName:header,
          columnIndex:this.fileHeaders.indexOf(header),
          swichOpened:false,
          contactsData:this.contactsData.map((res)=>{return {title:res,value:this.contactsData.indexOf(res)+1}}),
          selected:null,
          form: form
        }
      })

    }
    console.log("row data",this.rowsData)
  }
  change(item:FilesData){
    item.contactsData=this.contactsData.map((res)=>{return {title:res,value:this.contactsData.indexOf(res)+1}})

  }
  checkValidation(rows: FilesData[]) {
    const mobileSelected = rows.some((row) => row.selected && row.selected.title === 'Mobile Number');
    const contactNameSelected = rows.some((row) => row.selected && row.selected.title === 'Contact Name');
    this.valid = mobileSelected && contactNameSelected;
    console.log("valid", this.valid,mobileSelected);
  }
  onSelect(event,item:FilesData){

    item.selected={
      title:event.title,
      value:event.value
    };

    item.contactsData=this.contactsData.map((res)=>{return {title:res,value:this.contactsData.indexOf(res)+1}})
     let filterdRows=this.rowsData.filter((row)=>row.columnIndex!=item.columnIndex)
     filterdRows.map((row)=>{
      if(row.selected){
        if(row.selected.title==event.title){
          row.selected=null;
          row.form.patchValue({
            contacts:null
          })
        }
      }
    });
    this.checkValidation(this.rowsData)
    console.log(filterdRows)

  //   this.selectedHeaders.push(event.title)
  //   let filterdContacts=this.contactsData.filter((contact)=>!this.selectedHeaders.includes(contact));

  //   let filterdRows=this.rowsData.filter((row)=>row.columnIndex!=item.columnIndex)
  //   filterdRows.map((row)=>{

  //     row.contactsData=filterdContacts.map((res)=>{

  //       return{title:res,value:this.contactsData.indexOf(res)+1}

  //   })


  // })
  }
  onSwitcherChange(e,item){

    if (!e.target.checked) {
      item.form.get('contacts').enable(); // Enable the form control
    } else {
      item.form.get('contacts').disable(); // Disable the form control
      item.selected=null;
      item.form.patchValue({
        contacts:null
      })

    }

    this.checkValidation(this.rowsData)

}

  importFile(){
    // rowData:this.fileData[0].excelData[0],
    // withHeader:this.containsHeadear,
    // listId:this.listId,
    // base64:this.fileData[0].url
    let additionalParameters=this.rowsData.filter((row)=>row.swichOpened).map((filtered)=>{return{Name:filtered.columnName,index:filtered.columnIndex}})
    let mobileRow=this.rowsData.find((row)=>row.selected && row.selected.title=="Mobile Number");
    let conNameRow=this.rowsData.find((row)=>row.selected && row.selected.title=="Contact Name");
    let compNameRow=this.rowsData.find((row)=>row.selected && row.selected.title=="Company Name");
    let noteRow=this.rowsData.find((row)=>row.selected && row.selected.title=="Note");


    let mobileIndex=mobileRow.columnIndex;
    let contactNameIndex=conNameRow.columnIndex;
    let noteIndex=noteRow?noteRow.columnIndex:-1;
    let companyIndex=compNameRow?compNameRow.columnIndex:-1;

    console.log({
      name:conNameRow,
      mobile:mobileRow,
      company:compNameRow,
      note:noteRow
    })
    const fileData={
      file:this.data.base64,
      email:this.authService.getUserInfo()?.email,
      isFirstHeader:this.data.withHeader,
      mobileNumberIndex:mobileIndex,
      contactNameIndex:contactNameIndex,
      noteIndex:noteIndex,
      companyNameIndex:companyIndex,
      listId:[this.data.listId],
      additionalContactParametersIndexes:additionalParameters.length>0?additionalParameters:null


    }
   this.loading=true;
    const filteredFileData = this.filterData(fileData);
    this.listService.importFile(filteredFileData).subscribe(
      (res)=>{
        this.loading=false;
        this.onClose(this.data)
        this.toaster.success(this.translate.instant("COMMON.SUCC_MSG"))
      },
      (err)=>{
        this.loading=false;
        this.onClose(this.data);
      }
    )

    console.log(filteredFileData)
    // mobileNumberIndex:this.contactsData.indexOf("Mobile Number"),
    // contactNameIndex:this.contactsData.indexOf("Contact Name"),
    // noteIndex:this.contactsData.indexOf("Note"),
    // companyNameIndex:this.contactsData.indexOf("Company Name")
  }
  filterData(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      if (key === 'listId') {
        if (Array.isArray(obj[key]) && obj[key][0] !== undefined) {
          acc[key] = obj[key];
        }
      } else if (obj[key] !== null && obj[key] !== undefined) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }

  backToUpload(){
    this.onClose();
  }
  onClose(data?):void {
    this.dialogRef.close(data);
  }

}

// file:string,
// listId:string,
// email:string,
// isFirstHeader:boolean,
// additionalContactParametersIndexes:{Name:string,index:number},
// mobileNumberIndex:number,
// contactNameIndex:number,
// noteIndex:number,
// companyNameIndex:number
// i want to apply i18n translation on angular app, so i will provide to you the html files and you will replace the plain text with a Keys and you will make the json file that having the Keys and the values in english and another file in arabic
