import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmLogOut',
  templateUrl: './confirmLogOut.component.html',
  styleUrls: ['./confirmLogOut.component.scss']
})
export class ConfirmLogOutComponent implements OnInit {
  isLoading:boolean;
  constructor(public dialogRef: MatDialogRef<ConfirmLogOutComponent>,private router:Router) { }

  ngOnInit() {
  }
  submit() {
this.isLoading=true;
this.clearLocatStorage();
this.onClose();
this.isLoading=false;
this.router.navigateByUrl("login");
  }
clearLocatStorage(){
    let localData=['email','organizationName','id','userName',"token","customerId","apiToken","maskType","phoneNumber","timeZone"]
    localData.map((key)=>localStorage.removeItem(key))

  }
  onClose(): void {
    this.dialogRef.close();
}

}
