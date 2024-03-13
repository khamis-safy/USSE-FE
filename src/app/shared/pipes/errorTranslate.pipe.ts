import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'errorTranslate'
})
export class ErrorTranslatePipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: any, args?: any): any {
    if(this.translate.translations['en'][value]){
      return true
    }
    else{
      return false
    }
  
  }
}
