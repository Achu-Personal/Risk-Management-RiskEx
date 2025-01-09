import { Component, ElementRef, Input, output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-form-button',
  standalone: true,
  imports: [],
  templateUrl: './form-button.component.html',
  styleUrl: './form-button.component.scss'
})
export class FormButtonComponent {
@Input() label:string=''

@Input() type: 'button' | 'submit' | 'reset' = 'button'
constructor(private el: ElementRef, private renderer: Renderer2){}

clicked = output();

  onClick(): void {
    this.clicked.emit();
  }
}
