import { ChangeDetectorRef, Component } from '@angular/core';
import { RiskBasicDetailsCardComponent } from '../../Components/risk-basic-details-card/risk-basic-details-card.component';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { RiskDetailsSection2Component } from '../../Components/risk-details-section2/risk-details-section2.component';
import { RiskDetailsSection3MitigationComponent } from '../../Components/risk-details-section3-mitigation/risk-details-section3-mitigation.component';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeRiskStatusComponent } from "../../Components/change-risk-status/change-risk-status.component";
import { catchError, of } from 'rxjs';
import { FormLoaderComponent } from "../../Components/form-loader/form-loader.component";
import { FormSuccessfullComponent } from "../../Components/form-successfull/form-successfull.component";
import { HttpErrorResponse } from '@angular/common/http';
import { StatusChangeReviewerPopupComponent } from "../../Components/status-change-reviewer-popup/status-change-reviewer-popup.component";

@Component({
  selector: 'app-view-risk',
  standalone: true,
  imports: [
    RiskBasicDetailsCardComponent,
    BodyContainerComponent,
    RiskDetailsSection2Component,
    RiskDetailsSection3MitigationComponent,
    CommonModule,
    ChangeRiskStatusComponent,
    FormLoaderComponent,
    FormSuccessfullComponent,
    StatusChangeReviewerPopupComponent
],
  templateUrl: './view-risk.component.html',
  styleUrl: './view-risk.component.scss',
})
export class ViewRiskComponent {
  data: any = [];
  basdicDetailsData:any={}
  riskDetailsSection2Data:any={}
  riskDetailsSection3MitigationData:any={}

    RiskStatuses: Array<{
    id: number;
    name: string;
  }> = [];

  constructor(public api: ApiService, public route: ActivatedRoute,  private cdRef: ChangeDetectorRef) { }
  isLoading=true
  isShowPopupForUpdateStatus=false;
  isLoader=false;
  RiskId:number=0;
  isSuccess: boolean = false;
  isError: boolean = false;
  error: string = '';
  isReviewerShow: boolean = false;
  payloadForReview: any;

  ngOnInit() {

      this.api.getRiskStatus().pipe(
            catchError((error) => {
              console.error('Error fetching Reviewer responses:', error);
              return of([]); // Return an empty array to prevent app crash
            })
          )
          .subscribe((res: any) => {
            this.RiskStatuses = res;
            this.cdRef.detectChanges();
          });

    let id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.RiskId=id;
    this.api.getRiskById(id).subscribe((e) => {
      // console.log('Data=', e);
      this.data = e;

      this.basdicDetailsData={
        riskNumber:this.data.riskNumber,
        riskType:this.data.riskType,
        riskDesc:this.data.riskDesc,
        riskName:this.data.riskName,
        overallRiskRating:this.data.overallRiskRating,
        riskStatus:this.data.riskStatus,
        isEditable:false,
        allData:this.data
      }

      this.riskDetailsSection2Data={
        riskMitigation:this.data.mitigation,
        riskContengency:this.data.contingency,
        responsibilityOfAction:this.data.responsibleUser.fullName        ,
        plannedActionDate:this.data.plannedActionDate,
        impact:this.data.impact,
        CreatedBy:this.data.createdBy.fullName,
        CreatedAt:this.data.createdAt,
        UpdatedBy:this.data.updatedBy.fullName,
        UpdatedAt:this.data.updatedAt,
        ReviewedBy:this.data.reviewedBy,
        ReviewedAt:this.data.reviewedAt,
        PostReviewedBy:this.data.postReviewedBy,
        PostReviewedAt:this.data.postReviewedAt,
        RiskStatus:this.data.riskStatus,
        ClosedDate:this.data.closedDate,
        RiskResponse:this.data.riskResponse,
        Remarks:this.data.remarks
      }

      this.riskDetailsSection3MitigationData={
        riskId:this.data.riskId,
        riskAssessments:this.data.riskAssessments,
        status:this.data.riskStatus,
        type:this.data.riskType,
        residualRisk:this.data.residualRisk,
        residualValue:this.data.residualValue,
        percentageReduction:this.data.percentageRedution,
        overallRiskRatingBefore:this.data.overalRiskRatingBefore,
        overallRiskRatingAfter:this.data.overallRiskRatingAfter

      }


      this.isLoading=false
    });
  }





  handleEditClicked(isOpen: boolean) {
  console.log("Child notified parent →", isOpen);
  if (isOpen) {

    this.isShowPopupForUpdateStatus = true;
    console.log("isShowPopupForUpdateStatus",this.isShowPopupForUpdateStatus);
  }
}

hideModal(){
  this.isShowPopupForUpdateStatus=false;
  console.log("isShowPopupForUpdateStatus",this.isShowPopupForUpdateStatus);
}


handleSubmitForm(event:{ payload: any }){
  this.isLoader=true;
  const payload = event.payload;
  if(this.RiskId>0){
    this.api.updateRiskStatus(this.RiskId,payload).subscribe({
      next: (res) => {
        this.isLoader=false;
        this.isSuccess=true;
        this.hideModal();
      },
      error: (error: HttpErrorResponse) => {
                this.isError = true;
                this.isLoading = false;
                this.error = error.error?.details
                  ? error.error.details
                  : 'An unexpected error occurred. Please try again.';

                console.error('Error updating risk:', error);
              },
    });
  }

}

handleSendToReview(event:{ payload: any }){
  this.isReviewerShow=true;
  this.payloadForReview = event.payload;
}

closeDialogSuccess(){
  this.isSuccess=false
}

closeDialog(){
  this.isError=false
}

hideReviewerModal(){
   this.isReviewerShow=false;

}


submitSendToReview(event:{ payload: any }){
  this.isLoader=true;
  const payloadForReviewer = event.payload;
  console.log("Payload for Reviewer:", payloadForReviewer);
}
}
