import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDataNotInListComponent } from './form-data-not-in-list.component';

describe('FormDataNotInListComponent', () => {
  let component: FormDataNotInListComponent;
  let fixture: ComponentFixture<FormDataNotInListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDataNotInListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDataNotInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
