import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDetailsSection3MitigationComponent } from './risk-details-section3-mitigation.component';

describe('RiskDetailsSection3MitigationComponent', () => {
  let component: RiskDetailsSection3MitigationComponent;
  let fixture: ComponentFixture<RiskDetailsSection3MitigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskDetailsSection3MitigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskDetailsSection3MitigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
