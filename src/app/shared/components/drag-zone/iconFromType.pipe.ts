import { Pipe, PipeTransform } from '@angular/core';

enum icons {
  img= "imagesmode",
  video = "smart_display",
  other = "draft"
}

@Pipe({
  name: 'iconFromType'
})
export class IconFromTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let val = value.includes("image") ? icons.img :
    value.includes("video") ? icons.video  : icons.other;
    return val;
  }

}
