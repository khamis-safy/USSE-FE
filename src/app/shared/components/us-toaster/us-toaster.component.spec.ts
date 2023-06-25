/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UsToasterComponent } from './us-toaster.component';

describe('UsToasterComponent', () => {
  let component: UsToasterComponent;
  let fixture: ComponentFixture<UsToasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsToasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

