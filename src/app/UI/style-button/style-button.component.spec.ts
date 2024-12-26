import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { EventEmitter } from '@angular/core';
import { StyleButtonComponent } from './style-button.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('StyleButtonComponent', () => {
  let component: StyleButtonComponent;
  let fixture: ComponentFixture<StyleButtonComponent>;
  let button: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StyleButtonComponent],
      imports: [CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StyleButtonComponent);
    component = fixture.componentInstance;
    button = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  // it('should render label text correctly', () => {
  //   component.label = 'Submit';
  //   fixture.detectChanges();
  //   expect(button.nativeElement.textContent).toBe('Submit');
  // });

  // it('should have correct button type based on input', () => {
  //   component.type = 'submit';
  //   fixture.detectChanges();
  //   expect(button.nativeElement.type).toBe('submit');

  //   component.type = 'reset';
  //   fixture.detectChanges();
  //   expect(button.nativeElement.type).toBe('reset');
  // });

  // it('should be disabled when the disabled input is true', () => {
  //   component.disabled = true;
  //   fixture.detectChanges();
  //   expect(button.nativeElement.disabled).toBeTrue();
  // });

  // it('should not be disabled when the disabled input is false', () => {
  //   component.disabled = false;
  //   fixture.detectChanges();
  //   expect(button.nativeElement.disabled).toBeFalse();
  // });

  // it('should apply the correct CSS class based on the color input', () => {
  //   component.color = 'primary';
  //   fixture.detectChanges();
  //   expect(button.nativeElement.classList).toContain('primary');

  //   component.color = 'secondary';
  //   fixture.detectChanges();
  //   expect(button.nativeElement.classList).toContain('secondary');
  // });

  // it('should emit event when button is clicked', () => {
  //   spyOn(component.clicked, 'emit');
  //   button.triggerEventHandler('click', null);
  //   expect(component.clicked.emit).toHaveBeenCalled();
  // });

  // it('should not emit event when button is disabled', () => {
  //   spyOn(component.clicked, 'emit');
  //   component.disabled = true;
  //   fixture.detectChanges();
  //   button.triggerEventHandler('click', null);
  //   expect(component.clicked.emit).not.toHaveBeenCalled();
  // });

});
