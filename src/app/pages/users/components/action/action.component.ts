import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox'
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





    submitEdit() {
        console.log('edit work');

    }


    onClose(data?): void {
        this.dialogRef.close(data);
    }




}