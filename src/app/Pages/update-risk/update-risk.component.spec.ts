import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRiskComponent } from './update-risk.component';

describe('UpdateRiskComponent', () => {
  let component: UpdateRiskComponent;
  let fixture: ComponentFixture<UpdateRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRiskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
