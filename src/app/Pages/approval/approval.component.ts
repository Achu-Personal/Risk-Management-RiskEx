import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { RiskBasicDetailsCardComponent } from "../../Components/risk-basic-details-card/risk-basic-details-card.component";
import { RiskDetailsSection2Component } from "../../Components/risk-details-section2/risk-details-section2.component";
import {FormBuilder, FormControl,FormGroup,FormsModule,ReactiveFormsModule,} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../Components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { GlobalStateServiceService } from '../../Services/global-state-service.service';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [BodyContainerComponent, RiskBasicDetailsCardComponent, RiskDetailsSection2Component,FormsModule, ReactiveFormsModule],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent {
  data: any;

  constructor(private fb: FormBuilder, private dialog: MatDialog,private route: ActivatedRoute, private api:ApiService , public commentSignal:GlobalStateServiceService) {
    this.commentForm = this.fb.group({
      approve: [''] // Initial value
    });
  }

  async confirmAction(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message },
      width: '400px'

    });

    return await dialogRef.afterClosed().toPromise();
  }


  isButtonClicked:boolean = false;
  commentForm = new FormGroup({
  approve: new FormControl('')});
  cancelMessage: string = "";
  approveMessage: string = "";

  async ApproveRisk() {
  const confirmed = await this.confirmAction('Are you sure you want to approve this risk?');
  if(confirmed){
    const approveMessage = this.commentForm.value.approve || 'Default approval message';
    this.commentSignal.setData({ approve: approveMessage });

    // this.commentSignal.setData({ approve: this.commentForm.value.approve });
    console.log(this.commentForm.value);
    this.approveMessage = "The risk has been approved, The status of the risk will be updated";
    this.isButtonClicked= true;

  }

}

async cancelRisk() {
  const confirmed = await this.confirmAction('Are you sure you want to cancel?');
  if(confirmed){
    const approveMessage = this.commentForm.value.approve as string;
    this.commentSignal.setData({ approve: approveMessage });
    console.log(this.commentForm.value);
    this.commentForm.reset();
    this.cancelMessage = "The risk has been canceled as it was not approved. The owner will be notified shortly. ";
    this.isButtonClicked=true
  }

}
approvalId:number=0;



ngOnInit(): void {
  this.route.paramMap.subscribe((params) => {
    const rawApprovalId = params.get('id') || ''; // Fetch the dynamic ID
    this.approvalId = parseInt(rawApprovalId.slice(1), 10); // Extract the numeric part and convert to integer

    if (!isNaN(this.approvalId)) {
      this.api.getRiskById(this.approvalId).subscribe(e => {
        console.log("Data=", e);
        this.data = e;
      });
    } else {
      console.error('Invalid approvalId format:', rawApprovalId);
    }
  });
}

}
