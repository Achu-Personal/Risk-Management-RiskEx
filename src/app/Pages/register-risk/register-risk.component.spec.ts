import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRiskComponent } from './register-risk.component';

describe('RegisterRiskComponent', () => {
  let component: RegisterRiskComponent;
  let fixture: ComponentFixture<RegisterRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterRiskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
