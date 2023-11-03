import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceType'
})
export class DeviceType implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log("from device type pipe", value)
    return value=='WBS' ? 'assets/icons/whatsB.svg': value=='SMS'? 'assets/icons/sms.svg' :'assets/icons/whats.svg'

   
  }

}
