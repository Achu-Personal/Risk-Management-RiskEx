import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusChangeReviewerPopupComponent } from './status-change-reviewer-popup.component';

describe('StatusChangeReviewerPopupComponent', () => {
  let component: StatusChangeReviewerPopupComponent;
  let fixture: ComponentFixture<StatusChangeReviewerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusChangeReviewerPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusChangeReviewerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
