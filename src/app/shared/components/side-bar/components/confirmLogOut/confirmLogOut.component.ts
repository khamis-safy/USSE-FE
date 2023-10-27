import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-confirmLogOut',
  templateUrl: './confirmLogOut.component.html',
  styleUrls: ['./confirmLogOut.component.scss']
})
export class ConfirmLogOutComponent implements OnInit {
  isLoading:boolean;
  constructor(public dialogRef: MatDialogRef<ConfirmLogOutComponent>,
    private router:Router,
    private authService:AuthService) { }

  ngOnInit() {
  }
  submit() {
this.isLoading=true;
this.authService.clearUserInfo()
this.onClose();
this.isLoading=false;
this.router.navigateByUrl("login");
  }

  onClose(): void {
    this.dialogRef.close();
}

}
