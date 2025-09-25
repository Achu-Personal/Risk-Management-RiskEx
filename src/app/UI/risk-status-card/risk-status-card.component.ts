import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-risk-status-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-status-card.component.html',
  styleUrl: './risk-status-card.component.scss'
})
export class RiskStatusCardComponent {
  @Input() isOpen = false;
  @Output() editClicked = new EventEmitter<boolean>();


 onEditClick(event?: MouseEvent) {
    // optional: prevent parent handlers
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.editClicked.emit(true);
  }


}
