import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QmsEditComponent } from './qms-edit.component';

describe('QmsEditComponent', () => {
  let component: QmsEditComponent;
  let fixture: ComponentFixture<QmsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QmsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QmsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
