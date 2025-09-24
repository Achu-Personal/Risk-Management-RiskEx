import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRiskStatusComponent } from './change-risk-status.component';

describe('ChangeRiskStatusComponent', () => {
  let component: ChangeRiskStatusComponent;
  let fixture: ComponentFixture<ChangeRiskStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeRiskStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeRiskStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
