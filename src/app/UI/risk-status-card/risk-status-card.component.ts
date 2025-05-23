import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-risk-status-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-status-card.component.html',
  styleUrl: './risk-status-card.component.scss'
})
export class RiskStatusCardComponent {
  @Input() isOpen = false;

}
