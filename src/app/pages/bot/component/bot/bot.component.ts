import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {
  isBots:boolean =true;
  constructor() { }

  ngOnInit() {
  }
  backToBots(){
    this.isBots=true;
}
openNewAutomation(event){
  this.isBots=!event;
}
backToBotComponent(event){
  this.isBots=event;

}
}
