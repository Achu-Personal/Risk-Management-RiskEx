import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentDropdownComponent } from './department-dropdown.component';

describe('DepartmentDropdownComponent', () => {
  let component: DepartmentDropdownComponent;
  let fixture: ComponentFixture<DepartmentDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
