// import { Component } from '@angular/core';
// @Component({
//   selector: 'app-inbox',
//   templateUrl: './inbox.component.html',
//   styleUrls: ['./inbox.component.scss']
// })
// export class InboxComponent {



// }
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { MessageService } from '../../message.service';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent   {


  constructor() {}



  ngOnInit() {
  }

  openSnackBar(){

  }
  undoDelete(){


  }

  getContacts(){




  }




  contactsCount(){

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(){

  }
  onSortChange(){


  }
  onRowClick(){}

  openEditModal(){
 }



  onPageChange(){


  }
  onSearch(){

  }
  toggleActive(){

  }
  selectedRow(){

  }
  scrollRight(){


  }
  scrollLeft(){



}
changeColumns(){


}

destroy() {

}
}

