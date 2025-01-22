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
  @Input() disabled: boolean = false;
  @Input() color: string = 'primary';
  private _type: 'button' | 'submit' | 'reset' = 'button';

  @Input()
  get type(): 'button' | 'submit' | 'reset' {
    return this._type;
  }

  set type(value: 'button' | 'submit' | 'reset' | undefined) {
    this._type = value || 'button';
  }

  clicked = output();

  onClick(): void {
    this.clicked.emit();
  }
}
