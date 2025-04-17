import { CommonModule } from '@angular/common';
import { Component, Input, Output, output } from '@angular/core';

@Component({
  selector: 'app-edit-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-button.component.html',
  styleUrl: './edit-button.component.scss'
})
export class EditButtonComponent {


  onClick=output()
  @Input() showShadow=true
  @Input()  backgroundColor='white'
  @Input() image=""
  @Input() color='black'
  @Input() fontsize='16px'

  onClicked()
  {
    this.onClick.emit()
  }


}
