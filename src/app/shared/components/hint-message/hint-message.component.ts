import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hint-message',
  templateUrl: './hint-message.component.html',
  styleUrls: ['./hint-message.component.scss']
})
export class HintMessageComponent implements OnInit , OnDestroy {
  @Input() translatedMessage: string;
  sub:any;
  @Input() devicesWarning:boolean =false;
  @Input() isTrialMessage:boolean = false;
  @Output() closeWarning = new EventEmitter();
  trialMessage:string;
  constructor(private translate:TranslateService, private authService:AuthService) { 

    

  }
  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();

    }
  }
  translateMessage() {
    if(this.isTrialMessage){

      const specificDate = this.authService.getSubscriptionState()?.trialEndDate ; 
      const messagesCount =this.authService.getSubscriptionState()?.messageCount;
  
      this.sub= this.translate.get('trialEndMessage', { specificDate, messagesCount }).subscribe((res: string) => {
        this.trialMessage = res;
      });
    }

    

  }
  ngOnInit() {
    this.translateMessage();
  }
  onClose(){
    this.closeWarning.emit(true)
  }

}
