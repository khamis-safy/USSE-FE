import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pageNotFound',
  templateUrl: './pageNotFound.component.html',
  styleUrls: ['./pageNotFound.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  goBack(){
    this.router.navigateByUrl('devices')
  }
}
