import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSuccessfullComponent } from './form-successfull.component';

describe('FormSuccessfullComponent', () => {
  let component: FormSuccessfullComponent;
  let fixture: ComponentFixture<FormSuccessfullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSuccessfullComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSuccessfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
