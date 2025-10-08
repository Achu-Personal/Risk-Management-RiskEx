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
  @Input() riskStatus = "";
  @Output() editClicked = new EventEmitter<boolean>();
  @Input() isMitigatedRisk: boolean = false;
  @Input() isReviewPending: boolean = false;


 onEditClick(event?: MouseEvent) {
    // optional: prevent parent handlers
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.editClicked.emit(true);
  }

 getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'open': return '#DC2626';            // Red (Critical/High priority)
    case 'closed': return '#16A34A';          // Green (Resolved/Complete)
    case 'deferred': return '#F59E0B';        // Amber (Postponed)
    case 'undertreatment': return '#3B82F6';  // Blue (In progress)
    case 'accepted': return '#8B5CF6';        // Purple (Acknowledged)
    case 'monitoring': return '#EAB308';      // Yellow (Watch/Review)
    default: return '#9CA3AF';                // Gray (Unknown/Neutral)
  }
}


}
