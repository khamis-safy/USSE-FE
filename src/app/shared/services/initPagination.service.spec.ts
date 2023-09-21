/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InitPaginationService } from './initPagination.service';

describe('Service: InitPagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitPaginationService]
    });
  });

  it('should ...', inject([InitPaginationService], (service: InitPaginationService) => {
    expect(service).toBeTruthy();
  }));
});
