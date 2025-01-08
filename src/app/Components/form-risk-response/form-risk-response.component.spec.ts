import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRiskResponseComponent } from './form-risk-response.component';

describe('FormRiskResponseComponent', () => {
  let component: FormRiskResponseComponent;
  let fixture: ComponentFixture<FormRiskResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRiskResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRiskResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
