import { Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { RiskBasicDetailsCardComponent } from '../../Components/risk-basic-details-card/risk-basic-details-card.component';
import { RiskDetailsSection2Component } from '../../Components/risk-details-section2/risk-details-section2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { ConfirmationPopupComponent } from '../../Components/confirmation-popup/confirmation-popup.component';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

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
    ConfirmationPopupComponent,NgIf
    
  ],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss',
})
export class ApprovalComponent {
  data:any=[];
  constructor(public api: ApiService, public route:ActivatedRoute) {}
  ngOnInit(){
    console.log("initial data:",this.data);
    
    let id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.api.getRiskById(id).subscribe(e=>{
      console.log("Data=",e)
      this.data=e
      console.log("data description",this.data.description);
    });
    
  }
  


  isPopupOpen = false;
  popupTitle = '';
  popupConfirmText = '';
  showPopupComment = true;
  isPopupReject = false;


  isDataAvailable(): boolean {
    return this.data && Object.keys(this.data).length > 0;
  }


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
      const updates = {
        approvalStatus: "Rejected",
        comments: event.comment 
      };
      let id = parseInt(this.route.snapshot.paramMap.get('id')!);
      this.api.updateReviewStatusAndComments(id,updates);
    } else {
      console.log('Risk approved with comment:', event.comment);
      const updates = {
        approvalStatus: "Approved",
        comments: event.comment 
      };
      let id = parseInt(this.route.snapshot.paramMap.get('id')!);
      this.api.updateReviewStatusAndComments(id,updates);
      
    }
  }

  handlePopupCancel() {
    this.isPopupOpen = false;
    console.log('Popup canceled');
  }
}
