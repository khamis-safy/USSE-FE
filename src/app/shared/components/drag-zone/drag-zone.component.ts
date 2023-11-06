import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { uploadObject } from './drag-zone.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PreviewComponent } from './modals/preview/preview.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectComponent } from '../select/component/select.component';
import * as XLSX from "xlsx";
import { TranslateService } from '@ngx-translate/core';
import { ToasterServices } from '../us-toaster/us-toaster.component';
import { AuthService } from '../../services/auth.service';
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
  constructor(public dialog: MatDialog,
    private toaster:ToasterServices,
    private translate:TranslateService,
    private authService:AuthService) { 
      this.fileSize=this.authService.getAllowedFileSize();
    }
  private _value!: any;
   filesList: any ;
   isTouched = false; // to handle on touched only once
   invalidMessage:string;
  @Input() isLoading = false;
  @Input() multiple=true;
  @Input() isVcfFile:boolean=false;
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

async onChangeFile(e) {
  e.preventDefault();
  this.isTouched = true;
  let toBase64String: any = '';
  let reloadedFiles: string[] = [];

  for (let item of e?.dataTransfer?.files?.length ? e?.dataTransfer?.files : e?.target?.files?.length ? e?.target?.files : []) {
      toBase64String = await this.toBase64(item);
   
      const isReloaded = this.filesList.some(file => file.url === toBase64String);

      if(this.isFileSizeNotAllowed(item.size,this.authService.getAllowedFileSize())){
        this.toaster.warning(`${this.translate.instant("File_Size_Warning")} ${this.authService.getAllowedFileSize()} MB`)
      }
      // Check if the new file matches any existing file based on its base64 representation

      else if (isReloaded) {
        reloadedFiles.push(item.name); // Add the name of the reloaded file to the list
      } 
       else {
          // File is not already uploaded, add it to the list
          if (this.fileType !== "" && !this.multiple && !this.isVcfFile) {
              if (item.name.endsWith('.xlsx') || item.name.endsWith('.xls')) {
                  this.invalid = false;
                  const fileData = await this.readExcelData(item);
                  this.filesList.push(
                      {
                          name: item.name,
                          type: item.type,
                          url: toBase64String,
                          size: item.size,
                          excelData: fileData // Store Excel data here
                      }
                  );
              } else {
                this.invalidMessage='INVALID_FILE_MESSAGE.excel'

                  this.invalid = true;
              }
          } 
          else if (this.fileType !== "" && !this.multiple && this.isVcfFile) {
            // Validation to check if the uploaded file is in VCF format
                if (item.name.endsWith('.vcf')) {
                  this.invalid = false;

                    // File is a VCF file, you can handle it accordingly
                    // Your logic for processing VCF files goes here
                    // For example, you can read the VCF file content or perform any specific actions
                    this.filesList.push({
                        name: item.name,
                        type: item.type,
                        url: toBase64String,
                        size: item.size
                    });
                } else {
                  this.invalidMessage='INVALID_FILE_MESSAGE.vcf'
                  this.invalid = true;
                   
                }
            
        }
        
          else {
              this.filesList.push(
                  {
                      name: item.name,
                      type: item.type,
                      url: toBase64String,
                      size: item.size
                  }
              );
          }
      }
  }

  this.onChange(this.filesList);
  this.handleTouched();
  this.onFileChange.emit(toBase64String);
 // Log a message if any file was reloaded
 if (reloadedFiles.length > 0) {
  const reloadedFilesMessage = `( ${reloadedFiles.join(', ')} ) ${this.translate.instant("already_uploaded")}`;
  this.toaster.warning(reloadedFilesMessage)

}
  

  this.isLoading = false;
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput.value = ''; // Clear the input field value
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
  // Reset the input field to allow re-uploading the same file
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput.value = ''; // Clear the input field value

  }
  isFileSizeNotAllowed(fileSize,allowedSize){
      if(fileSize < 1024*1024){
        return false
      }
      else{
        let sizeInMB=(parseInt(fileSize)/1024/1024).toFixed(2);

        if(sizeInMB > allowedSize){
          return true;
        }
        else{
          return false
        }
      }
   
    
  }
}
