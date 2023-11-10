/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdditonalParamsComponent } from './additonalParams.component';

describe('AdditonalParamsComponent', () => {
  let component: AdditonalParamsComponent;
  let fixture: ComponentFixture<AdditonalParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditonalParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditonalParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
