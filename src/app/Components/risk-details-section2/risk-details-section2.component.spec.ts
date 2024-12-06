import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDetailsSection2Component } from './risk-details-section2.component';

describe('RiskDetailsSection2Component', () => {
  let component: RiskDetailsSection2Component;
  let fixture: ComponentFixture<RiskDetailsSection2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskDetailsSection2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskDetailsSection2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
