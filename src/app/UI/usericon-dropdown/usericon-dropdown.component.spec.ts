import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsericonDropdownComponent } from './usericon-dropdown.component';

describe('UsericonDropdownComponent', () => {
  let component: UsericonDropdownComponent;
  let fixture: ComponentFixture<UsericonDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsericonDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsericonDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
