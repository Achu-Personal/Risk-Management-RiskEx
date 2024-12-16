import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ISMSFormComponent } from './isms-form.component';

describe('ISMSFormComponent', () => {
  let component: ISMSFormComponent;
  let fixture: ComponentFixture<ISMSFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ISMSFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ISMSFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
