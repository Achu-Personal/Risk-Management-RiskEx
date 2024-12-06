import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallRatingCardComponent } from './overall-rating-card.component';

describe('OverallRatingCardComponent', () => {
  let component: OverallRatingCardComponent;
  let fixture: ComponentFixture<OverallRatingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallRatingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallRatingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
