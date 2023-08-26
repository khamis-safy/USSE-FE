import { Component, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'] ,
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
})
export class ChatsComponent implements OnInit{
  constructor(){
  }
  ngOnInit() { }



}
