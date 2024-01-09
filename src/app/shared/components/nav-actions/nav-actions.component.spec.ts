/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NavActionsComponent } from './nav-actions.component';

describe('NavActionsComponent', () => {
  let component: NavActionsComponent;
  let fixture: ComponentFixture<NavActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
