import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-two',
  templateUrl: './layout-two.component.html',
  styleUrls: ['./layout-two.component.scss']
})
export class LayoutTwoComponent implements OnInit {

  activeSidebar= false;
  constructor(private render:Renderer2) { }

  ngOnInit(): void {
  }
  sidebarTogg(){
    this.activeSidebar = !this.activeSidebar;
  }
  SidebarToggleHov(sidebar:any){
    console.log(sidebar)
    sidebar.classList.toggle("close-sidebar")
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationState'];
   }

}
