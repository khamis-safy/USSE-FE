import { Component, OnInit, ViewChild, } from '@angular/core';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { CompaignsService } from '../../compaigns.service';
import { WriteMessageComponent } from 'src/app/pages/messages/Components/new-message/write-message/write-message.component';
// import { WriteMessageComponent } from 'src/app/pages/messages/Components/new-message/write-message/write-message.component';
@Component({
  selector: 'app-addCompaigns',
  templateUrl: './addCompaigns.component.html',
  styleUrls: ['./addCompaigns.component.scss']
})

export class AddCompaignsComponent implements OnInit {
  attachments:string[]=[];
  @ViewChild(WriteMessageComponent) writeMessage:WriteMessageComponent;

  lists:ListData[]=[];
  constructor(private compaignsService:CompaignsService){}
  ngOnInit() {
  }
  getLists(listsData){
    this.lists=listsData;
  }
  filesUrls(e){
    this.attachments=e;
  }
toSecondStep(){
  console.log("selected lists",this.lists);
  this.writeMessage.getTemplates();

}
toThirdStep(){

}

  }

