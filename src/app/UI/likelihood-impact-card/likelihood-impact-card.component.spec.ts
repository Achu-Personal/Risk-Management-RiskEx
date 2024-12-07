import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikelihoodImpactCardComponent } from './likelihood-impact-card.component';

describe('LikelihoodImpactCardComponent', () => {
  let component: LikelihoodImpactCardComponent;
  let fixture: ComponentFixture<LikelihoodImpactCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikelihoodImpactCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikelihoodImpactCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
