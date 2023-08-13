import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientActivitiesComponent } from './recipientActivities.component';

describe('RecipientActivitiesComponent', () => {
  let component: RecipientActivitiesComponent;
  let fixture: ComponentFixture<RecipientActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipientActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipientActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
