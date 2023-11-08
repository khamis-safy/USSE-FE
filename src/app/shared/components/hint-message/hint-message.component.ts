import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hint-message',
  templateUrl: './hint-message.component.html',
  styleUrls: ['./hint-message.component.scss']
})
export class HintMessageComponent implements OnInit , OnDestroy {
  @Output() hideMessage = new EventEmitter<boolean>(false);
  @Input() trialEndDate:string="";
  @Input() messageCount:number=0;
  translatedMessage: string;
  sub:any
  constructor(private translate:TranslateService) { 
    this.translateMessage();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  translateMessage() {
    const specificDate = this.trialEndDate || ""; // Replace this with your specific date variable
    const messagesCount =this.messageCount; // Replace this with your messages count variable

    this.sub= this.translate.get('trialEndMessage', { specificDate, messagesCount }).subscribe((res: string) => {
      this.translatedMessage = `${res} contact@qweira.com .`;
    });
  }
  ngOnInit() {
  }
  onClose(){
    this.hideMessage.emit(true)
  }

}
