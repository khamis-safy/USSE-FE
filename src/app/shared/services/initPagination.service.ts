import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class InitPaginationService {

constructor(
  private matPaginatorIntl:MatPaginatorIntl,
  private translate:TranslateService

) {
 }
   init(){
    this.matPaginatorIntl.itemsPerPageLabel = this.translate.instant("ITEMS_PER_PAGE")
    this.matPaginatorIntl.getRangeLabel =(page: number, pageSize: number, length: number) =>{
      return `${page+1} - ${length} ${this.translate.instant("OF_KEYWORD")} ${length < pageSize ? length : pageSize}`;
    }
  }

}
