import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcSize'
})
export class CalcSizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let val = parseInt(value) < 1024*1024 ?
      `${(parseInt(value)/1024).toFixed(2)} KB` :
      `${(parseInt(value)/1024/1024).toFixed(2)} MB`;
    return val;
  }

}
