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
  chars:string=this.userName.split(" ",2).map((e)=>e.charAt(0).toUpperCase()).join("");
  show:boolean=false;
  listsArr:SelectOption[]
  displaySetting:boolean=false;
  permissions:Permission;
  isUser:boolean;
  constructor(public plugin:PluginsService,private render:Renderer2, private userServiece:UsersService,public dialog: MatDialog ,private authService:AuthService) {}
  ngOnInit(): void {
    if(this.authService.userInfo.customerId!=""){
      this.isUser=true;
      let email=this.authService.userInfo.email;
      this.getUserPermisisons(email);
    }
    else{
      this.isUser=false;
this.permissions={  Messages:true,
  Templates:true,
  Campaigns:true,
  Bots:true,
  Devices:true,
  Contacts:true
    }

  }}
  getUserPermisisons(email){
      this.userServiece.getUserByEmail(email).subscribe(
        (res)=>{

          this.permissions=this.userServiece.executePermissions(res.permissions);
          if(!this.permissions.Messages){
            this.permissions.Messages=true
          }
          if(!this.permissions.Campaigns){
            this.permissions.Campaigns=true
          }
          this.authService.updateUserPermisisons(res.permissions)
          console.log(this.permissions)
        },
        (err)=>{}
      )

  }
  showOptions(){this.show=!this.show;}
  openSettingModal(){

    //this.displaySetting=true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '81vh';
    dialogConfig.width = '45vw';
    dialogConfig.maxWidth = '100%';
    dialogConfig.minWidth = '300px';
    dialogConfig.maxHeight = '87vh';
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(SettingComponent, dialogConfig);
  }



}
