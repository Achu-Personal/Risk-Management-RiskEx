import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleButtonComponent } from './style-button.component';

describe('StyleButtonComponent', () => {
  let component: StyleButtonComponent;
  let fixture: ComponentFixture<StyleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StyleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
