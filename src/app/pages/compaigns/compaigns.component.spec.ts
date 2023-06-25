import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaignsComponent } from './compaigns.component';

describe('CompaignsComponent', () => {
  let component: CompaignsComponent;
  let fixture: ComponentFixture<CompaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaignsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
