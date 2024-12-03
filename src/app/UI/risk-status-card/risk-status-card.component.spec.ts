import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskStatusCardComponent } from './risk-status-card.component';

describe('RiskStatusCardComponent', () => {
  let component: RiskStatusCardComponent;
  let fixture: ComponentFixture<RiskStatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskStatusCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
