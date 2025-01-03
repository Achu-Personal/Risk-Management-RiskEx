import { Component, output } from '@angular/core';

@Component({
  selector: 'app-update-button',
  standalone: true,
  imports: [],
  templateUrl: './update-button.component.html',
  styleUrl: './update-button.component.scss'
})
export class UpdateButtonComponent {
  onClick=output()

  onClicked()
  {
    this.onClick.emit()
  }
}
