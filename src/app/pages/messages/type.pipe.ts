import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'type'
})
export class TypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
  const  imageTypes = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "tiff",
      "tif",
      "webp",
      "svg",
      "raw"
    ];
    const videoTypes = [
      "mp4",
      "webm",
      "avi",
      "mov",
      "mkv",
      "flv",
      "wmv",
      "m4v",
      "3gp",
      "mpeg"
    ];
    return imageTypes.filter((type:any)=>type==value.split(".")[1].toLowerCase()).length ? "assets/images/image.svg":

    videoTypes.filter((type:any)=>type==value.split(".")[1].toLowerCase()).length ? "assets/images/document.svg":
    "assets/images/document.svg"
    ;
  }

}
