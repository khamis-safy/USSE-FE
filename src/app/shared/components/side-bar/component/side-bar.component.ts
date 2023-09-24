import { Component, OnInit, Renderer2 } from '@angular/core';
import { PluginsService } from 'src/app/services/plugins.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SettingComponent } from '../components/setting/setting.component';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersService } from 'src/app/pages/users/users.service';
import { Permission } from 'src/app/pages/users/users';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})

export class SideBarComponent implements OnInit {
  userName:string=this.authService.userInfo.userName;
  chars:string=this.userName?.split(" ",2).map((e)=>e.charAt(0).toUpperCase()).join("");
  show:boolean=false;
  listsArr:SelectOption[]
  displaySetting:boolean=false;
  permissions:Permission;
  isUser:boolean;
  constructor(public plugin:PluginsService,private render:Renderer2, private userServiece:UsersService,public dialog: MatDialog ,private authService:AuthService) {}
  ngOnInit(): void {
    if(this.authService.userInfo.customerId!=""){
      this.isUser=true;
      this.permissions=this.authService.userPermissions
      // let email=this.authService.userInfo.email;
      // this.getUserPermisisons(email);
    }
    else{
      this.isUser=false;
this.permissions={
  Templates:true,
  Bots:true,
  Devices:true,
  Contacts:true
    }

  }}
//   getUserPermisisons(email){
//       this.userServiece.getUserByEmail(email).subscribe(
//         (res)=>{
// this.authService.userPermissions=res;
// console.log(res.permissions)
//           this.permissions=this.userServiece.executePermissions(res.permissions);

//           console.log(this.permissions)
//         },
//         (err)=>{}
//       )

//   }
  showOptions(){this.show=!this.show;}
  openSettingModal(){

    //this.displaySetting=true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '83vh';
    dialogConfig.width = '55vw';
    dialogConfig.maxWidth = '100%';
    dialogConfig.minWidth = '300px';
    dialogConfig.maxHeight = '87vh';
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(SettingComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
     this.userName=localStorage.getItem("userName")
     this.chars=this.userName?.split(" ",2).map((e)=>e.charAt(0).toUpperCase()).join("");
    });
  }


  clearLocatStorage(){
    localStorage.clear()
  }
}
