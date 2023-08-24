import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SelectOption } from 'src/app/shared/components/select/select-option.model';


@Component({

    selector: 'app-addUser',
    templateUrl: './addUser.component.html',
    styleUrls: ['./addUser.component.scss'],
   // standalone: true,
    //imports: [MatCardModule, MatCheckboxModule, FormsModule, MatRadioModule ,MatSelectModule]

})
export class AddUserComponent {
    constructor(public dialogRef: MatDialogRef<AddUserComponent>) { }
    listsArr:SelectOption[]
    next=false;
   


    submitSave() {
        console.log('edit work');
        this.onClose()
    }


    onClose(data?): void {
        this.dialogRef.close(data);
    }

    openNext(){
        this.next=true;
    }
    openPrevious(){
        this.next=false;
    }



  




}