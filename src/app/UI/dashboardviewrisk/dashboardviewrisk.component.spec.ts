import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardviewriskComponent } from './dashboardviewrisk.component';

describe('DashboardviewriskComponent', () => {
  let component: DashboardviewriskComponent;
  let fixture: ComponentFixture<DashboardviewriskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardviewriskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardviewriskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
