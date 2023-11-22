/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BotComponent } from './bot.component';

describe('BotComponent', () => {
  let component: BotComponent;
  let fixture: ComponentFixture<BotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
