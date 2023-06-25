/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ErrInputComponent } from './err-input.component';

describe('ErrInputComponent', () => {
  let component: ErrInputComponent;
  let fixture: ComponentFixture<ErrInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
