import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSummaryComponent } from './reportSummary.component';

describe('ReportSummaryComponent', () => {
  let component: ReportSummaryComponent;
  let fixture: ComponentFixture<ReportSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
