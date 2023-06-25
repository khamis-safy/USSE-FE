import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  form:any;
  email:any = new FormControl('',[Validators.required]);
  data:any
  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      email:this.email
    })
  }

}
