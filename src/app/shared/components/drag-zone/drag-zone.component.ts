import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { uploadObject } from './drag-zone.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PreviewComponent } from './modals/preview/preview.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectComponent } from '../select/component/select.component';
import * as XLSX from "xlsx";
const VALUE_ACCESSOR_CONFIG = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DragZoneComponent),
  multi: true,
};

@Component({
  selector: 'us-upload',
  templateUrl: './drag-zone.component.html',
  styleUrls: ['./drag-zone.component.scss'],
  providers: [VALUE_ACCESSOR_CONFIG],
})
export class DragZoneComponent implements OnInit {
  constructor(public dialog: MatDialog,) { }
  private _value!: any;
   filesList: any ;
   isTouched = false; // to handle on touched only once
  @Input() isLoading = false;
  @Input() multiple=true;
  @Input() isDisabled?: boolean; // force disable dropdown
  @Input("label") label ="Select a file or drag and drop here";
  @Input("fileSize") fileSize =10;
  @Input("fileType") fileType ="";
  invalid:boolean=false;
  @Input('data') set value(value) {
    this._value = value;
  }
  get value() {
    return this._value;
  }
  @Output() onFileChange = new EventEmitter();
  @Output() onFileDelete = new EventEmitter();


  onChange = (value: any) => {}; // to register value accessor method onChange
  onTouched = () => {}; // to register value accessor method onTouched
  // Value Accessor Methods
  writeValue(value: any): void {
    this.filesList=value;
    if (!value) this._value = null
    else this._value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  handleTouched(): void {
    if (this.isTouched) this.onTouched();
  }

  ngOnInit(): void {


  }

  toBase64(file){
    this.isLoading= true
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
  });
  }
  async  onChangeFile(e){
    e.preventDefault();
    this.isTouched= true;
    let toBase64String:any = '';

    for(let item of e?.dataTransfer?.files?.length ? e?.dataTransfer?.files : e?.target?.files?.length ? e?.target?.files :[]){
      toBase64String =await this.toBase64(item);

      if(this.fileType!="" && !this.multiple){
        if (item.name.endsWith('.xlsx') || item.name.endsWith('.xls')) {
          this.invalid=false;
          this.filesList=[];
          const fileData = await this.readExcelData(item);
          this.filesList.push(
            {
              name:item.name,
              type:item.type,
              url:toBase64String,
              size:item.size,
              excelData: fileData, // Store Excel data here
            }
          )
        }
        else{
          this.invalid=true;
        }


      }
      else{
        this.filesList.push(
          {
            name:item.name,
            type:item.type,
            url:toBase64String,
            size:item.size
          }
        )
      }

    }

    this.onChange(this.filesList);
    this.handleTouched();
    this.onFileChange.emit(toBase64String)
    this.isLoading= false
  }
  async readExcelData(fileData) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const binaryData = event.target.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Assuming you want to read the first sheet

        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        resolve(excelData);
      };
      reader.readAsBinaryString(fileData);
    });
  }
  test(e){
    e.preventDefault();
  }
  openPreviewModal(url){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='80vh';
    dialogConfig.width='80vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='80vw';
    dialogConfig.maxHeight='80vh';
    dialogConfig.disableClose = true;
    dialogConfig.data= url;
    this.dialog.open(PreviewComponent,dialogConfig);
  }
  deleteFile(file){
    let index = this.filesList.findIndex(res=>{
      return res.url.split(',')[1].slice(1, 20) ==file.url.split(',')[1].slice(1, 20)
    })
    this.filesList.splice(index,1)
    this.onChange(this.filesList);
    this.onFileDelete.emit(true)


  }
}
