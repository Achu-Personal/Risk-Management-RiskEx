import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QMSFormComponent } from './qms-form.component';

describe('QMSFormComponent', () => {
  let component: QMSFormComponent;
  let fixture: ComponentFixture<QMSFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QMSFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QMSFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
