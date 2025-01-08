import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedResponseComponent } from './rejected-response.component';

describe('RejectedResponseComponent', () => {
  let component: RejectedResponseComponent;
  let fixture: ComponentFixture<RejectedResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
