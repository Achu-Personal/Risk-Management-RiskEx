import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReferenceHeatmapPopupComponent } from './form-reference-heatmap-popup.component';

describe('FormReferenceHeatmapPopupComponent', () => {
  let component: FormReferenceHeatmapPopupComponent;
  let fixture: ComponentFixture<FormReferenceHeatmapPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormReferenceHeatmapPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormReferenceHeatmapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
