import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SelectOption } from 'src/app/shared/components/select/select-option.model';


@Component({

    selector: 'app-action',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.scss'],
   // standalone: true,
    //imports: [MatCardModule, MatCheckboxModule, FormsModule, MatRadioModule ,MatSelectModule]

})
export class ActionComponent {
    constructor(public dialogRef: MatDialogRef<ActionComponent>) { }
    listsArr:SelectOption[]





    submitSave() {
        console.log('edit work');
        this.onClose()
    }


    onClose(data?): void {
        this.dialogRef.close(data);
    }




}