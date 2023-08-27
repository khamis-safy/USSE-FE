import { Component, OnInit, Renderer2 } from '@angular/core';
import { PluginsService } from 'src/app/services/plugins.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SettingComponent } from '../components/setting/setting.component';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  userName:string=this.authService.userInfo().userName;
  chars:string=this.userName.split(" ",2).map((e)=>e.charAt(0).toUpperCase()).join("");
  show:boolean=false;
  listsArr:SelectOption[]
  displaySetting:boolean=false;

  constructor(public plugin:PluginsService,private render:Renderer2 ,public dialog: MatDialog ,private authService:AuthService) {}
  ngOnInit(): void {}
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
