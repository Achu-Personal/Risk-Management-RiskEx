import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownDeparmentComponent } from './drop-down-deparment.component';

describe('DropDownDeparmentComponent', () => {
  let component: DropDownDeparmentComponent;
  let fixture: ComponentFixture<DropDownDeparmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownDeparmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropDownDeparmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
