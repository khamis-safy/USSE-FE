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
  @Input() trialMessage:boolean = false;
  @Output() closeWarning = new EventEmitter();
  
  constructor(private translate:TranslateService, private authService:AuthService) { 

    this.translateMessage();

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  translateMessage() {
    if(this.trialMessage){

      const specificDate = this.authService.getSubscriptionState()?.trialEndDate ; 
      const messagesCount =this.authService.getSubscriptionState()?.messageCount;
  
      this.sub= this.translate.get('trialEndMessage', { specificDate, messagesCount }).subscribe((res: string) => {
        this.translatedMessage = res;
      });
    }


  }
  ngOnInit() {
   
  }
  onClose(){
    this.closeWarning.emit(true)
  }

}
