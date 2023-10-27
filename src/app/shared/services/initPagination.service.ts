import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class InitPaginationService {
  currentLang: string;

constructor(
  private matPaginatorIntl:MatPaginatorIntl,
  private translate:TranslateService

) {
  this.currentLang = localStorage.getItem('currentLang') || 'en';
 }
 async  init(){
    await this.translate.get('ITEMS_PER_PAGE').toPromise().then((translation: string) => {
      this.matPaginatorIntl.itemsPerPageLabel = translation;
    });
      this.matPaginatorIntl.getRangeLabel =(page: number, pageSize: number, length: number ,) =>{
        return `${pageSize * page +1} - ${length <= pageSize || length <= pageSize * page + pageSize ? length : pageSize * page + pageSize}  ${this.translate.instant("OF_KEYWORD")} ${length}`;

    }
  }

}
