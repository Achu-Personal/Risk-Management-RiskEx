import { Directive, ElementRef, AfterViewInit, Renderer2, Input, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appFocus]',
  standalone: true
})
export class FocusDirective implements AfterViewInit {

  private modalElement: HTMLElement | null = null;
  @Input() appFocus:boolean=false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.modalElement = this.findModal(this.el.nativeElement);
    if(this.appFocus){
    if (this.modalElement) {
      this.renderer.listen(this.modalElement, 'shown.bs.modal', () => {
        console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
        setTimeout(() => this.setFocus(), 100);

      });
    }
    else {
      console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
      this.setFocus();
    }
  }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['appFocus'] && changes['appFocus'].currentValue) {
      this.setFocus();
    }
  }

  setFocus() {

      setTimeout(() => {
        this.el.nativeElement.focus();
        console.log('Focused on:', this.el.nativeElement);
      }, 0);
  }

  private findModal(element: HTMLElement): HTMLElement | null {
    while (element) {
      if (element.classList.contains('modal')) {
        return element;
      }
      element = element.parentElement as HTMLElement;
    }
    return null;
  }
}
