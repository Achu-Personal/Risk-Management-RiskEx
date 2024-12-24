import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-style-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './style-button.component.html',
  styleUrl: './style-button.component.scss'
})
export class StyleButtonComponent {
  @Input() label: string = 'Click Me'; 
  @Input() type: 'button' | 'submit' | 'reset' = 'button'; 
  @Input() disabled: boolean = false; 
  @Input() color: string = 'primary'; 

  clicked = output();

  onClick(): void {
    this.clicked.emit();
  }
}
