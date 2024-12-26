import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleButtonComponent } from './style-button.component';
import { By } from '@angular/platform-browser';

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
  it('should initialize with default values', () => {
    fixture.detectChanges();

    expect(component.label).toBe('Click Me');
    expect(component.type).toBe('button');
    expect(component.disabled).toBeFalse();
    expect(component.color).toBe('primary');
  });

  it('should emit clicked event when the button is clicked', () => {
    spyOn(component.clicked, 'emit'); // Spy on the output event

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null); // Trigger click event

    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should disable the button when disabled input is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBeTrue();
  });

  // Test: Button class is applied correctly based on the color input property
  it('should apply the correct class based on the color input', () => {
    component.color = 'secondary';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.classList).toContain('secondary');
  });

  // Test: Button is enabled when disabled input is false
  it('should enable the button when disabled input is false', () => {
    component.disabled = false;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBeFalse();
  });
});
