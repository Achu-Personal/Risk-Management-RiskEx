
import { Directive, ElementRef, HostListener, Input, TemplateRef , ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appOne]',
  standalone: true
})
export class OneDirective {
  constructor(private el: ElementRef) {}

  @Input() appOne = '';

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appOne);
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
