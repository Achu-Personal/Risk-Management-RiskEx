import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbaordCardContainerComponent } from './dashbaord-card-container.component';

describe('DashbaordCardContainerComponent', () => {
  let component: DashbaordCardContainerComponent;
  let fixture: ComponentFixture<DashbaordCardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbaordCardContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbaordCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
