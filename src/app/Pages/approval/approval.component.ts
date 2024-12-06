import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { RiskBasicDetailsCardComponent } from "../../Components/risk-basic-details-card/risk-basic-details-card.component";
import { RiskDetailsSection2Component } from "../../Components/risk-details-section2/risk-details-section2.component";
import {FormControl,FormGroup,FormsModule,ReactiveFormsModule,} from '@angular/forms';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [BodyContainerComponent, RiskBasicDetailsCardComponent, RiskDetailsSection2Component,FormsModule, ReactiveFormsModule],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent {


  commentForm = new FormGroup({
    approve: new FormControl('')});
    cancelMessage: string = "";
  approveMessage: string = "";

ApproveRisk() {
  console.log(this.commentForm.value);
  this.approveMessage = "The risk has been approved, The status of the risk will be updated";
}

cancelRisk() {
  console.log(this.commentForm.value);
  this.commentForm.reset();
  this.cancelMessage = "The risk has been canceled as it was not approved. The owner will be notified shortly. ";
}

}
