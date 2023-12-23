/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnCancelContactsComponent } from './unCancelContacts.component';

describe('UnCancelContactsComponent', () => {
  let component: UnCancelContactsComponent;
  let fixture: ComponentFixture<UnCancelContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnCancelContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnCancelContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
