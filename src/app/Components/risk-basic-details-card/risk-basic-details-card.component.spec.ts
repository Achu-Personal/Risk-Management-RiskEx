import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskBasicDetailsCardComponent } from './risk-basic-details-card.component';

describe('RiskBasicDetailsCardComponent', () => {
  let component: RiskBasicDetailsCardComponent;
  let fixture: ComponentFixture<RiskBasicDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskBasicDetailsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskBasicDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
