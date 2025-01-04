import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDateFieldComponent } from './form-date-field.component';

describe('FormDateFieldComponent', () => {
  let component: FormDateFieldComponent;
  let fixture: ComponentFixture<FormDateFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDateFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDateFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
