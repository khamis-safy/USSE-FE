import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-layout-two',
  templateUrl: './layout-two.component.html',
  styleUrls: ['./layout-two.component.scss']
})
export class LayoutTwoComponent implements OnInit {
  showTrialHintMessage:boolean=false;
  activeSidebar= false;
  constructor(private render:Renderer2, private authService:AuthService) { }

  ngOnInit(): void {
 
    this.showTrialHintMessage=this.authService.getSubscriptionState().isTrail ? this.authService.getSubscriptionState()?.isTrail : false;

   
  }
  hideMessage(event){
    this.showTrialHintMessage=event;
  }
  
  
  sidebarTogg(){
    this.activeSidebar = !this.activeSidebar;
  }
  SidebarToggleHov(sidebar:any){
    sidebar.classList.toggle("close-sidebar")
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationState'];
   }

}
