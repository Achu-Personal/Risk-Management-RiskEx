import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQmsComponent } from './update-qms.component';

describe('UpdateQmsComponent', () => {
  let component: UpdateQmsComponent;
  let fixture: ComponentFixture<UpdateQmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateQmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateQmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
