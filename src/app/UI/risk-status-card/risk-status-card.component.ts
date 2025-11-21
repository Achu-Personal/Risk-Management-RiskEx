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
  @Input() preReviewStatus: any = null;
  @Input() postReviewStatus: any = null;
  @Input() createdById: number = 0;
  @Input() responsibleUserId: number = 0;
  @Input() currentUserId: number | string | null = 0;
  @Input() userRole: string | null = "";

  // Method to check if edit button should be shown - SAME LOGIC AS EDIT/UPDATE BUTTONS
  shouldShowEditButton(): boolean {

    if (!this.isMitigatedRisk) {
      return false;
    }

    if (!this.preReviewStatus || !this.postReviewStatus) {
      return false;
    }

    // Convert currentUserId to number if it's a string
    const currentUserIdNum = typeof this.currentUserId === 'string'
      ? parseInt(this.currentUserId)
      : (this.currentUserId ?? 0);

    // ✅ SAME PERMISSION CHECK AS OTHER BUTTONS
    // Only Admin, Creator, or Responsible User can see the button
    const hasPermission =
      currentUserIdNum === this.createdById ||
      currentUserIdNum === this.responsibleUserId ||
      this.userRole === "Admin";

    if (!hasPermission) {
      return false;
    }

    // ✅ SAME CONDITION AS EDIT/UPDATE BUTTONS
    // Check if reviews are not in certain states
    const preNotPending = this.preReviewStatus.isReviewed !== 1;
    const postNotCompleted = this.postReviewStatus.isReviewed !== 3;

    // If first review is rejected (5)
    if (this.preReviewStatus.isReviewed === 5) {
      // ✅ SAME AS EDIT BUTTON: Only Admin and Creator can see
      return currentUserIdNum === this.createdById || this.userRole === "Admin";
    }

    // ✅ SAME AS EDIT/UPDATE BUTTON LOGIC
    // Show if pre-review not pending AND post-review not completed
    if (preNotPending && postNotCompleted) {
      return true;
    }

    // ✅ ADDITIONAL CONDITION: Show when both reviews are completed
    // This allows status change after all approvals
    if (this.preReviewStatus.isReviewed >= 2 && this.postReviewStatus.isReviewed >= 4) {
      return true;
    }


    return false;
  }

  onEditClick(event?: MouseEvent) {
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
