import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermanagementpopupComponent } from './usermanagementpopup.component';

describe('UsermanagementpopupComponent', () => {
  let component: UsermanagementpopupComponent;
  let fixture: ComponentFixture<UsermanagementpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsermanagementpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsermanagementpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
