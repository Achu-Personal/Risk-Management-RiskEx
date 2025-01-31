import { FocusDirective } from './focus.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [FocusDirective],
  template: `
    <div class="modal">
      <input type="text" appFocus />
    </div>
  `
})
class TestComponent {}

fdescribe('FocusDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directive: FocusDirective;
  let inputElement: HTMLInputElement;
  let modalElement: HTMLElement;

  function setup() {
    const focusSpy = spyOn(inputElement, 'focus').and.callThrough();
    fixture.detectChanges();
    return focusSpy;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const debugElement = fixture.debugElement.query(By.directive(FocusDirective));
    directive = debugElement.injector.get(FocusDirective);
    inputElement = debugElement.nativeElement;
    modalElement = fixture.nativeElement.querySelector('.modal');
  });

  it('should create directive', () => {
    setup();
    expect(directive).toBeTruthy();
  });

  it('should properly inject ElementRef and Renderer2', () => {
    setup();
    expect(directive['el']).toBeTruthy();
    expect(directive['renderer']).toBeTruthy();
  });

  it('should return null when no modal ancestor exists', () => {
    setup();

    spyOnProperty(inputElement, 'parentElement', 'get').and.returnValue(null);

    const result = directive['findModal'](inputElement);

    expect(result).toBeNull();
  });

  it('should find the modal element when inside a modal', () => {
    setup();
    const foundModalElement = directive['findModal'](inputElement);

    expect(foundModalElement).toBeTruthy();
    expect(foundModalElement).toBe(modalElement);
    expect(foundModalElement?.classList.contains('modal')).toBeTrue();
  });

  it('should focus when modal is shown', fakeAsync(() => {
    const focusSpy = setup();

    modalElement.dispatchEvent(new Event('shown.bs.modal'));
    tick(100);

    expect(focusSpy).toHaveBeenCalled();
  }));

  it('should handle multiple modal shown events', fakeAsync(() => {
    const focusSpy = setup();

    modalElement.dispatchEvent(new Event('shown.bs.modal'));
    tick(100);
    modalElement.dispatchEvent(new Event('shown.bs.modal'));
    tick(100);

    expect(focusSpy).toHaveBeenCalledTimes(2);
  }));

  it('should handle null parent element ', fakeAsync(() => {
    const focusSpy = setup();
    spyOn<any>(directive, 'findModal').and.returnValue(null);

    directive.ngAfterViewInit();
    tick(100);

    expect(focusSpy).toHaveBeenCalled();
  }));

  it('should focus the element after view init', fakeAsync(() => {
    const focusSpy = setup();

    directive.ngAfterViewInit();
    directive.setFocus();
    tick(100);

    expect(focusSpy).toHaveBeenCalled();
  }));

});
