import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';

@Component({

    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss'],
   // standalone: true,
    //imports: [MatCardModule, MatCheckboxModule, FormsModule, MatRadioModule ,MatSelectModule]

})
export class SettingComponent {
    constructor(public dialogRef: MatDialogRef<SettingComponent>) { }
    timeZoneArr:SelectOption[];
    maskTypeArr:SelectOption[] ;
    
   


    // submitSave() {
    //     console.log('edit work');
    //     this.onClose()
    // }

    onClose(data?): void {
        this.dialogRef.close(data);
    }
}