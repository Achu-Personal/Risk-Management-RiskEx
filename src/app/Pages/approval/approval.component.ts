import { Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { RiskBasicDetailsCardComponent } from '../../Components/risk-basic-details-card/risk-basic-details-card.component';
import { RiskDetailsSection2Component } from '../../Components/risk-details-section2/risk-details-section2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { ConfirmationPopupComponent } from '../../Components/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [
    BodyContainerComponent,
    RiskBasicDetailsCardComponent,
    RiskDetailsSection2Component,
    FormsModule,
    ReactiveFormsModule,
    StyleButtonComponent,
    ConfirmationPopupComponent,
  ],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss',
})
export class ApprovalComponent {
  data:any;
  constructor(public api: ApiService) {}
  // ngOnInit(){
  //   this.api.getRiskById().subscribe(e => e.result)
  // }
  // data = {
  //   risk_description: 'Risk description here...',
  //   risk_name: 'Risk Name',
  //   risk_number: 'RISK-001',
  //   risk_type: 'Type A',
  //   assessment_post_implementation: { overall_risk_rating: 5 },
  //   risk_status: 'Pending',
  //   risk_mitigation: 'Mitigation strategy here...',
  //   impact_of_risk: 'Impact details here...',
  //   risk_contingency: 'Contingency plan here...',
  //   responsibility_of_action: 'Responsible person',
  //   planned_action_date: '2025-01-31',
  // };

  isPopupOpen = false;
  popupTitle = '';
  popupConfirmText = '';
  showPopupComment = true;
  isPopupReject = false;

  openPopup(isReject: boolean) {
    this.isPopupOpen = true;
    this.isPopupReject = isReject;

    if (isReject) {
      this.popupTitle = 'Reject Risk';
      this.popupConfirmText = 'Reject';
    } else {
      this.popupTitle = 'Approve Risk';
      this.popupConfirmText = 'Approve';
    }
  }

  handlePopupConfirm(event: { comment: string }) {
    this.isPopupOpen = false;

    if (this.isPopupReject) {
      console.log('Risk rejected with comment:', event.comment);
      // Perform rejection logic here
    } else {
      console.log('Risk approved with comment:', event.comment);
      // Perform approval logic here
    }
  }

  handlePopupCancel() {
    this.isPopupOpen = false;
    console.log('Popup canceled');
  }
}
