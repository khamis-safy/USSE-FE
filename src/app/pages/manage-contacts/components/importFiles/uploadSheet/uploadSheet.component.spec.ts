/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UploadSheetComponent } from './uploadSheet.component';

describe('UploadSheetComponent', () => {
  let component: UploadSheetComponent;
  let fixture: ComponentFixture<UploadSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
