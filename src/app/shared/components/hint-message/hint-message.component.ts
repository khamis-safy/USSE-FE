import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hint-message',
  templateUrl: './hint-message.component.html',
  styleUrls: ['./hint-message.component.scss']
})
export class HintMessageComponent implements OnInit , OnDestroy {
  translatedMessage: string;
  @Output() showMessage = new EventEmitter();
  sub:any
  constructor(private translate:TranslateService, private authService:AuthService) { 

    this.translateMessage();

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  translateMessage() {
    const specificDate = this.authService.getSubscriptionState()?.trialEndDate ; 
    const messagesCount =this.authService.getSubscriptionState()?.messageCount;

    this.sub= this.translate.get('trialEndMessage', { specificDate, messagesCount }).subscribe((res: string) => {
      this.translatedMessage = `${res} contact@qweira.com .`;
    });
  }
  ngOnInit() {
    setTimeout(() => {
      this.showMessage.emit(false)      
    }, 6000);
  }
 

}
