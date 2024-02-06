import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {
  isBots:boolean =true;
  automationData:any
  constructor() { }

  ngOnInit() {
  }
  backToBots(){
    this.isBots=true;
}
openNewAutomation(event){
  this.isBots=!event.openNewAutomation;
  this.automationData=event.editAutomationData;

}
backToBotComponent(event){
  this.isBots=event;

}
addAutomation(){
  this.isBots=false;
}
}
