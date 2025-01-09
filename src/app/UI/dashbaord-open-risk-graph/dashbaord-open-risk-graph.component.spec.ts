import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbaordOpenRiskGraphComponent } from './dashbaord-open-risk-graph.component';

describe('DashbaordOpenRiskGraphComponent', () => {
  let component: DashbaordOpenRiskGraphComponent;
  let fixture: ComponentFixture<DashbaordOpenRiskGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbaordOpenRiskGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbaordOpenRiskGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
