import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompaignsComponent } from './addCompaigns.component';

describe('AddCompaignsComponent', () => {
  let component: AddCompaignsComponent;
  let fixture: ComponentFixture<AddCompaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCompaignsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCompaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
