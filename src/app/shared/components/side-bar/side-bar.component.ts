import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PluginsService } from 'src/app/services/plugins.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  userName:string="john daniel";
  chars:string=this.userName.split(" ",2).map((e)=>e.charAt(0).toUpperCase()).join("");
  show:boolean=false

  constructor(public dialog: MatDialog,public plugin:PluginsService,private render:Renderer2) {
  }
  ngOnInit(): void {
  }
  showOptions(){
    this.show=!this.show
  }

  // fixedSidebar(radio:any){
  //   radio.classList.toggle("switch");
  //   let body:any =document.querySelector(".default-layout");
  //   body.classList.toggle("resizable");

  //   let sidebar:any =document.querySelector(".sidebar-comp");
  //   sidebar.classList.toggle("sidebar-comp-fixed");

  //   let navbar:any =document.querySelector(".navbar-comp");
  //   navbar.classList.toggle("resizable-navbar");
  // }

}
