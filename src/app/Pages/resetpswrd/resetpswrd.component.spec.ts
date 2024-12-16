import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpswrdComponent } from './resetpswrd.component';

describe('ResetpswrdComponent', () => {
  let component: ResetpswrdComponent;
  let fixture: ComponentFixture<ResetpswrdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetpswrdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetpswrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
