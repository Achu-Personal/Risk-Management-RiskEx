import { OneDirective } from './one.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div appOne="yellow">Hover over me</div>`,
})
class TestComponent {}

fdescribe('OneDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [OneDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    // all elements with an attached HighlightDirective
    debugElement = fixture.debugElement.query(By.directive(OneDirective));
    fixture.detectChanges();
  });

  it('should OneDirective', () => {
    expect(debugElement).toBeTruthy();
  });

  it('should apply background color on mouse enter', () => {
    debugElement.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    expect(debugElement.nativeElement.style.backgroundColor).toBe('yellow');
  });

  it('should remove background color on mouse leave', () => {
    debugElement.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    debugElement.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();
    expect(debugElement.nativeElement.style.backgroundColor).toBe('');
  });
});
