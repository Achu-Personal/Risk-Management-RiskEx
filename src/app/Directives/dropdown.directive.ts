import { Directive, ElementRef, AfterViewInit, Renderer2, OnDestroy, signal, computed, effect } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  standalone: true
})
export class DropdownDirective implements AfterViewInit, OnDestroy {
  private dropdownElement = signal<HTMLElement | null>(null);
  private mutationObserver: MutationObserver | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Setup effect to watch for dropdown element changes
    effect(() => {
      const element = this.dropdownElement();
      if (element) {
        this.observeDropdown(element);
        this.setFocus();
      }
    });
  }

  ngAfterViewInit() {
    this.dropdownElement.set(this.findDropdown(this.el.nativeElement));
  }

  private setFocus() {
    queueMicrotask(() => {
      const element = this.dropdownElement();
      if (!element) return;

      let focusableElement = element.querySelector('input, select, [tabindex]:not([tabindex="-1"])') as HTMLElement;

      if (!focusableElement) {
        focusableElement = element;
      }

      focusableElement.focus();
      console.log('Focused on dropdown:', focusableElement);
    });
  }

  private findDropdown(element: HTMLElement): HTMLElement | null {
    while (element) {
      if (element.classList.contains('custom-dropdown-container')) {
        return element;
      }
      element = element.parentElement as HTMLElement;
    }
    return null;
  }

  private observeDropdown(target: HTMLElement) {
    this.mutationObserver?.disconnect();

    this.mutationObserver = new MutationObserver(() => {
      if (target.classList.contains('show')) {
        this.setFocus();
      }
    });

    this.mutationObserver.observe(target, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy() {
    this.mutationObserver?.disconnect();
  }
}
