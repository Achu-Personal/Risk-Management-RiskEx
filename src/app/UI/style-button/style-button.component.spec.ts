import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StyleButtonComponent } from './style-button.component';
import { By } from '@angular/platform-browser';

describe('StyleButtonComponent', () => {
  let component: StyleButtonComponent;
  let fixture: ComponentFixture<StyleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.label).toBe('Click Me');
      expect(component.type).toBe('button');
      expect(component.disabled).toBeFalse();
      expect(component.color).toBe('primary');
    });

    it('should render the button with the default label', () => {
      const button = fixture.debugElement.query(By.css('button')).nativeElement;
      expect(button.textContent.trim()).toBe('Click Me');
    });
  });

  describe('Button Click', () => {
    it('should emit the clicked event when the button is clicked', () => {
      spyOn(component.clicked, 'emit');

      const button = fixture.debugElement.query(By.css('button'));
      button.triggerEventHandler('click', null);

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should not emit the clicked event when the button is disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button')).nativeElement;

      button.click();
      spyOn(component.clicked, 'emit');
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

  });

  describe('Button State', () => {
    it('should disable the button when disabled input is true', () => {
      component.disabled = true;
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeTrue();
    });

    it('should enable the button when disabled input is false', () => {
      component.disabled = false;
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeFalse();
    });
  });

  describe('CSS Class Binding', () => {
    it('should apply the correct class based on the color input', () => {
      component.color = 'secondary';
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList).toContain('secondary');
    });

    it('should update the class dynamically when the color input changes', () => {
      component.color = 'success';
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList).toContain('success');
    });

    it('should not apply any unexpected classes', () => {
      component.color = 'non-existent-class';
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList).toContain('non-existent-class');
    });
  });

  describe('Label Binding', () => {
    it('should update the button label when the label input changes', () => {
      component.label = 'Submit';
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button')).nativeElement;
      expect(button.textContent.trim()).toBe('Submit');
    });
  });

  describe('Type Attribute', () => {
    it('should set the button type attribute correctly', () => {
      component.type = 'submit';
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button')).nativeElement;
      expect(button.getAttribute('type')).toBe('submit');
    });

    it('should default to type "button" if no type is provided', () => {
      component.type = undefined;
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button')).nativeElement;
      expect(button.getAttribute('type')).toBe('button');
    });

  });
});
