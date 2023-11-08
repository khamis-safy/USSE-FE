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
  trialEndDate:string;
  messageCount:number;
  activeSidebar= false;
  constructor(private render:Renderer2, private authService:AuthService) { }

  ngOnInit(): void {
    this.trialEndDate=this.authService.getSubscriptionState()?.trialEndDate;
    this.showTrialHintMessage=this.authService.getSubscriptionState().isTrail ? this.authService.getSubscriptionState()?.isTrail : false;
    this.messageCount=this.authService.getSubscriptionState()?.messageCount;
    setTimeout(() => {
      this.hideMessage();      
    }, 5000);
  }
  hideMessage(){
    this.showTrialHintMessage=!this.showTrialHintMessage;
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
