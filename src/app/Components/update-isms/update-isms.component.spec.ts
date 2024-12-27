import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIsmsComponent } from './update-isms.component';

describe('UpdateIsmsComponent', () => {
  let component: UpdateIsmsComponent;
  let fixture: ComponentFixture<UpdateIsmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateIsmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateIsmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
