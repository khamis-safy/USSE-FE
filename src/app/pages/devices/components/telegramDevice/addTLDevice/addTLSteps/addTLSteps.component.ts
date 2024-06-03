import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-addTLSteps',
  templateUrl: './addTLSteps.component.html',
  styleUrls: ['./addTLSteps.component.scss']
})
export class AddTLStepsComponent implements OnInit {
  @Output() goToAddTL = new EventEmitter<any>;
  constructor() { }

  ngOnInit() {
  }
  onClose(){}
  addTlDevice(){
    this.goToAddTL.emit(true)
  }
}
