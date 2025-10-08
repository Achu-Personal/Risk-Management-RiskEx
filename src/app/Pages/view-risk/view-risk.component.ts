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
import { EmailService } from '../../Services/email.service';
import { AuthService } from '../../Services/auth/auth.service';

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
  basdicDetailsData: any = {}
  riskDetailsSection2Data: any = {}
  riskDetailsSection3MitigationData: any = {}

  RiskStatuses: Array<{
    id: number;
    name: string;
  }> = [];

  constructor(public api: ApiService, public route: ActivatedRoute, private cdRef: ChangeDetectorRef, private emailService: EmailService, private authService: AuthService) { }
  isLoading = true
  isShowPopupForUpdateStatus = false;
  isLoader = false;
  RiskId: number = 0;
  isSuccess: boolean = false;
  isError: boolean = false;
  error: string = '';
  isReviewerShow: boolean = false;
  payloadForReview: any;
  dropdownDataLikelihood: any[] = [];
  dropdownDataImpact: any[] = [];
  residualRisk: number = 0;

  dropdownDataReviewer: Array<{
    id: number;
    fullName: string;
    email: string;
    type: string;
  }> = [];

  ngOnInit() {

    this.api
      .getAllReviewer()
      .pipe(
        catchError((error) => {
          console.error('Error fetching Reviewers:', error);
          return of({ reviewers: [] });
        })
      )
      .subscribe((res: any) => {
        const sortedReviewers = res.reviewers.sort((a: any, b: any) => {
          const fullNameA = a.fullName ? a.fullName.toLowerCase() : '';
          const fullNameB = b.fullName ? b.fullName.toLowerCase() : '';
          return fullNameA.localeCompare(fullNameB);
        });
        this.dropdownDataReviewer = sortedReviewers;
        this.cdRef.detectChanges();
      });

    this.api.getRiskStatus().pipe(
      catchError((error) => {
        console.error('Error fetching Reviewer responses:', error);
        return of([]);
      })
    )
      .subscribe((res: any) => {
        this.RiskStatuses = res;
        this.cdRef.detectChanges();
      });

    let id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.RiskId = id;
    this.api.getRiskById(id).subscribe((e) => {
      console.log('Data=', e);
      this.data = e;

      this.basdicDetailsData = {
        riskNumber: this.data.riskNumber,
        riskType: this.data.riskType,
        riskDesc: this.data.riskDesc,
        riskName: this.data.riskName,
        overallRiskRating: this.data.overallRiskRating,
        riskStatus: this.data.riskStatus,
        isEditable: false,
        allData: this.data,
        ISOClause: this.data.isoClauseNumber
      }

      this.riskDetailsSection2Data = {
        riskMitigation: this.data.mitigation,
        riskContengency: this.data.contingency,
        responsibilityOfAction: this.data.responsibleUser.fullName,
        plannedActionDate: this.data.plannedActionDate,
        impact: this.data.impact,
        CreatedBy: this.data.createdBy.fullName,
        CreatedAt: this.data.createdAt,
        UpdatedBy: this.data.updatedBy.fullName,
        UpdatedAt: this.data.updatedAt,
        ReviewedBy: this.data.reviewedBy,
        ReviewedAt: this.data.reviewedAt,
        PostReviewedBy: this.data.postReviewedBy,
        PostReviewedAt: this.data.postReviewedAt,
        RiskStatus: this.data.riskStatus,
        ClosedDate: this.data.closedDate,
        RiskResponse: this.data.riskResponse,
        Remarks: this.data.remarks
      }

      this.riskDetailsSection3MitigationData = {
        riskId: this.data.riskId,
        riskAssessments: this.data.riskAssessments,
        status: this.data.riskStatus,
        type: this.data.riskType,
        residualRisk: this.data.residualRisk,
        residualValue: this.data.residualValue,
        percentageReduction: this.data.percentageRedution,
        overallRiskRatingBefore: this.data.overalRiskRatingBefore,
        overallRiskRatingAfter: this.data.overallRiskRatingAfter

      }
      this.isLoading = false

    });




    this.api
      .getLikelyHoodDefinition()
      .pipe(
        catchError((error) => {
          console.error('Error fetching Likelihood Definitions:', error);
          return of([]); // Return an empty array to prevent app crash
        })
      )
      .subscribe((res: any) => {
        this.dropdownDataLikelihood = res;
        console.log("dropdownDataLikelihood", this.dropdownDataLikelihood);
        this.cdRef.detectChanges();
      });
    this.api
      .getImpactDefinition()
      .pipe(
        catchError((error) => {
          console.error('Error fetching Impact Definitions:', error);
          return of([]);
        })
      )
      .subscribe((res: any) => {
        this.dropdownDataImpact = res;
        console.log("dropdownDataImpact", this.dropdownDataImpact);
        this.cdRef.detectChanges();
      });
  }





  handleEditClicked(isOpen: boolean) {
    console.log("Child notified parent →", isOpen);
    if (isOpen) {

      this.isShowPopupForUpdateStatus = true;
      console.log("isShowPopupForUpdateStatus", this.isShowPopupForUpdateStatus);
    }
  }

  hideModal() {
    this.isShowPopupForUpdateStatus = false;
    console.log("isShowPopupForUpdateStatus", this.isShowPopupForUpdateStatus);
  }


  handleSubmitForm(event: { payload: any }) {
    this.isLoader = true;
    const payload = event.payload;
    if (this.RiskId > 0) {
      this.api.updateRiskStatus(this.RiskId, payload).subscribe({
        next: (res) => {
          this.isLoader = false;
          this.isSuccess = true;
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

  handleSendToReview(event: { payload: any }) {
    this.isReviewerShow = true;
    this.payloadForReview = event.payload;
  }

  closeDialogSuccess() {
    this.isSuccess = false
  }

  closeDialog() {
    this.isError = false
  }

  hideReviewerModal() {
    this.isReviewerShow = false;

  }


  submitSendToReview(event: { payload: any }) {
    this.isLoader = true;
    const payloadForReviewer = event.payload;
    // console.log("Payload for Reviewer:", payloadForReviewer);
    // console.log(this.payloadForReview)

    if (this.data.riskType == "Quality") {

      if (Number(this.data.residualValue) <= 4) {
        this.residualRisk = 1;
      } else if (Number(this.data.residualValue) >= 6 && Number(this.data.residualValue) <= 16) {
        this.residualRisk = 2;
      } else if (Number(this.data.residualValue) >= 24) {
        this.residualRisk = 3;
      }

      const payload = {
        closedDate: this.payloadForReview.closedDate ? `${this.payloadForReview.closedDate}T00:00:00.000Z` : null,
        riskStatus: this.payloadForReview.riskStatus,
        overallRiskRatingAfter: Number(this.data.overallRiskRating),
        percentageRedution: Number(this.data.percentageRedution),
        residualRisk: Number(this.residualRisk) ? Number(this.residualRisk) : null,
        residualValue: Number(this.data.residualValue) ? Number(this.data.residualValue) : null,
        remarks: this.payloadForReview.remarks ? this.payloadForReview.remarks : this.data.remarks ? this.data.remarks : '',
        riskAssessments: [
          {
            likelihood: this.getLikelihoodId(this.dropdownDataLikelihood, this.data),
            impact: this.getImpactId(this.dropdownDataImpact, this.data),
            isMitigated: true,
            assessmentBasisId: null,
            riskFactor: Number(this.data.riskAssessments[0].riskFactor),
            review: {
              userId:
                payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0
                  ? Number(payloadForReviewer.reviewerId)
                  : null,
              externalReviewerId:
                !payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0
                  ? Number(payloadForReviewer.reviewerId)
                  : !payloadForReviewer.isInternal &&
                    payloadForReviewer.ExternalReviewerFromInput != 0
                    ? Number(payloadForReviewer.ExternalReviewerFromInput)
                    : null,
              comments: '',
              reviewStatus: 3,
            },
          },
        ],
      };
      // console.log("Final Payload for Reviewer:", payload);

      this.api.updateQualityRisk(payload, Number(this.data.id)).subscribe({
        next: (res: any) => {
          this.isLoader = false;
          // console.log('Updated quality API response:', res);
          this.isSuccess = true;
          this.hideReviewerModal();
          // this.sendReviewerMailOnClose();

          this.sendStatusChangeReviewEmail(payloadForReviewer);

        },
        error: (error: HttpErrorResponse) => {
          this.isError = true;
          this.isLoader = false;
          this.hideReviewerModal();
          // console.log("error from updating risk is",error)

          // Extract error message from backend response
          this.error = error.error?.details
            ? error.error.details
            : 'An unexpected error occurred. Please try again.';

          console.error('Error updating risk:', error);

          // Show the error message in a popup
        },
        complete: () => {
          console.log('Update quality risk request completed.');

        },
      });

    }

    else if (this.data.riskType == "Security" || this.data.riskType == "Privacy") {

      if (Number(this.data.residualValue) <= 45) {
        this.residualRisk = 1;
      } else if (Number(this.data.residualValue) >= 46 && Number(this.data.residualValue) <= 69) {
        this.residualRisk = 2;
      } else {
        this.residualRisk = 3;
      }

      const payload = {
        closedDate: this.payloadForReview.closedDate ? `${this.payloadForReview.closedDate}T00:00:00.000Z` : null,
        riskStatus: this.payloadForReview.riskStatus,
        overallRiskRatingAfter: Number(this.data.overallRiskRating),
        percentageRedution: Number(this.data.percentageRedution),
        residualRisk: Number(this.residualRisk) ? Number(this.residualRisk) : null,
        residualValue: Number(this.data.residualValue) ? Number(this.data.residualValue) : null,
        remarks: this.payloadForReview.remarks ? this.payloadForReview.remarks : this.data.remarks ? this.data.remarks : '',
        riskAssessments: [
          {
            likelihood: this.getSecurityLikelihoodId(this.dropdownDataLikelihood, this.data, 0),
            impact: this.getSecurityImpactId(this.dropdownDataImpact, this.data, 0),
            isMitigated: true,
            assessmentBasisId: 1,
            riskFactor: Number(this.data.riskAssessments[0].riskFactor),
            review: {
              userId:
                payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0
                  ? Number(payloadForReviewer.reviewerId)
                  : null,
              externalReviewerId:
                !payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0
                  ? Number(payloadForReviewer.reviewerId)
                  : !payloadForReviewer.isInternal &&
                    payloadForReviewer.ExternalReviewerFromInput != 0
                    ? Number(payloadForReviewer.ExternalReviewerFromInput)
                    : null,
              comments: '',
              reviewStatus: 3,
            },
          },
          {
            likelihood: this.getSecurityLikelihoodId(this.dropdownDataLikelihood, this.data, 1),
            impact: this.getSecurityImpactId(this.dropdownDataImpact, this.data, 1),

            isMitigated: true,
            assessmentBasisId: 2,
            riskFactor: Number(this.data.riskAssessments[1].riskFactor),
            review: {
              userId:
                payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0
                  ? Number(payloadForReviewer.reviewerId)
                  : null,
              externalReviewerId:
                !payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0
                  ? Number(payloadForReviewer.reviewerId)
                  : !payloadForReviewer.isInternal &&
                    payloadForReviewer.ExternalReviewerFromInput != 0
                    ? Number(payloadForReviewer.ExternalReviewerFromInput)
                    : null,
              comments: '',
              reviewStatus: 3,
            },
          },
          {
            likelihood: this.getSecurityLikelihoodId(this.dropdownDataLikelihood, this.data, 2),
            impact: this.getSecurityImpactId(this.dropdownDataImpact, this.data, 2),

            isMitigated: true,
            assessmentBasisId: 3,
            riskFactor: Number(this.data.riskAssessments[2].riskFactor),
            review: {
              userId:
                payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0
                  ? Number(payloadForReviewer.reviewerId)
                  : null,
              externalReviewerId:
                !payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0
                  ? Number(payloadForReviewer.reviewerId)
                  : !payloadForReviewer.isInternal &&
                    payloadForReviewer.ExternalReviewerFromInput != 0
                    ? Number(payloadForReviewer.ExternalReviewerFromInput)
                    : null,
              comments: '',
              reviewStatus: 3,
            },
          },
          {
            likelihood: this.getSecurityLikelihoodId(this.dropdownDataLikelihood, this.data, 3),
            impact: this.getSecurityImpactId(this.dropdownDataImpact, this.data, 3),

            isMitigated: true,
            assessmentBasisId: 4,
            riskFactor: Number(this.data.riskAssessments[3].riskFactor),
            review: {
              userId:
                payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0
                  ? Number(payloadForReviewer.reviewerId)
                  : null,
              externalReviewerId:
                !payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0
                  ? Number(payloadForReviewer.reviewerId)
                  : !payloadForReviewer.isInternal &&
                    payloadForReviewer.ExternalReviewerFromInput != 0
                    ? Number(payloadForReviewer.ExternalReviewerFromInput)
                    : null,
              comments: '',
              reviewStatus: 3,
            },
          },
        ],
      };
      this.api
        .updateSecurityOrPrivacyRisk(payload, Number(this.data.id))
        .subscribe({
          next: (res: any) => {
            this.isLoader = false;
            // console.log('Updated security API response:', res);
            this.isSuccess = true;
            this.hideReviewerModal();
            // this.sendReviewerMailOnClose();

            this.sendStatusChangeReviewEmail(payloadForReviewer);

          },
          error: (error: HttpErrorResponse) => {
            this.isError = true;
            this.isLoader = false;

            // Extract error message from backend response
            this.error = error.error?.message
              ? error.error.message
              : 'An unexpected error occurred. Please try again.';

            console.error('Error updating risk:', error);
            this.hideReviewerModal();

          },
          complete: () => {
            console.log('Update security risk request completed.');
            // this.sendReviewerMailOnClose();
          },
        });

    }
  }

  getLikelihoodId(dropdownList: any[], data: any): number | null {
    const match = dropdownList.find(
      (item: any) =>
        item.assessmentFactor?.toLowerCase() ===
        data.riskAssessments[0].likelihoodMatrix.likeliHood?.toLowerCase()
    );
    return match ? Number(match.id) : null;
  }


  getImpactId(dropdownList: any[], data: any): number | null {
    const match = dropdownList.find(
      (item: any) =>
        item.assessmentFactor?.toLowerCase() ===
        data.riskAssessments[0].impactMatix.impact?.toLowerCase()
    );
    return match ? Number(match.id) : null;
  }

  getSecurityLikelihoodId(dropdownList: any[], data: any, index: number): number | null {
    const match = dropdownList.find(
      (item: any) =>
        item.assessmentFactor?.toLowerCase() ===
        data.riskAssessments[index]?.likelihoodMatrix?.likeliHood?.toLowerCase()
    );
    return match ? Number(match.id) : null;
  }


  getSecurityImpactId(dropdownList: any[], data: any, index: number): number | null {
    const match = dropdownList.find(
      (item: any) =>
        item.assessmentFactor?.toLowerCase() ===
        data.riskAssessments[index]?.impactMatix?.impact?.toLowerCase()
    );
    return match ? Number(match.id) : null;
  }

  sendStatusChangeReviewEmail(payloadForReviewer: any) {
    let reviewerEmail = '';
    let reviewerId = 0;

    if (payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0) {
      reviewerId = Number(payloadForReviewer.reviewerId);
      const reviewer = this.dropdownDataReviewer?.find(
        (r: any) => r.id === Number(payloadForReviewer.reviewerId)
      );
      reviewerEmail = reviewer?.email || '';

      if (reviewerEmail) {
        this.sendEmail(reviewerEmail, reviewerId);
      } else {
        console.error('Internal reviewer email not found');
      }
    }
    else if (!payloadForReviewer.isInternal && Number(payloadForReviewer.reviewerId) !== 0) {
      reviewerId = Number(payloadForReviewer.reviewerId);
      const reviewer = this.dropdownDataReviewer?.find(
        (r: any) => r.id === reviewerId && r.type === 'External'
      );
      reviewerEmail = reviewer?.email || '';

      if (reviewerEmail) {
        this.sendEmail(reviewerEmail, reviewerId);
      } else {
        console.error('External reviewer email not found in loaded data');
      }
    }
    else if (!payloadForReviewer.isInternal && payloadForReviewer.ExternalReviewerFromInput && Number(payloadForReviewer.ExternalReviewerFromInput) !== 0) {
      reviewerId = Number(payloadForReviewer.ExternalReviewerFromInput);
      this.api.getAllReviewer().subscribe({
        next: (res: any) => {
          const newReviewer = res.reviewers?.find(
            (r: any) => r.id === reviewerId
          );
          reviewerEmail = newReviewer?.email || '';

          if (reviewerEmail) {
            this.sendEmail(reviewerEmail, reviewerId);
          } else {
            console.error('New external reviewer email not found');
          }
        },
        error: (error: any) => {
          console.error('Failed to fetch new external reviewer email:', error);
        }
      });
    } else {
      console.error('No valid reviewer selected');
    }
  }

  private sendEmail(reviewerEmail: string, reviewerId: number) {

    const reviewer = this.dropdownDataReviewer?.find(
      (r: any) => r.id === reviewerId
    );
    const reviewerName = reviewer?.fullName || 'Reviewer';

    const emailContext = {
      reviewer: reviewerName,
      responsibleUser: this.data.responsibleUser?.fullName || 'Unknown',
      riskId: this.data.riskNumber || this.data.riskId || '',
      riskName: this.data.riskName || '',
      description: this.data.riskDesc || this.data.description || '',
      riskType: this.data.riskType || '',
      impact: this.data.impact || 'Not specified',
      mitigation: this.data.mitigation || 'Not specified',
      plannedActionDate: this.data.plannedActionDate
        ? new Date(this.data.plannedActionDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        : 'Not specified',
      overallRiskRating: this.data.overallRiskRating || '',
      newStatus: this.getStatusName(this.payloadForReview.riskStatus),
      oldStatus: this.data.riskStatus || '',
      statusChangedBy: this.authService.getUserName() || 'Unknown',
      id: this.data.id || ''
    };


    this.emailService.sendStatusChangeReviewEmail(reviewerEmail, emailContext).subscribe({
      next: () => {
        console.log('Status change review email sent successfully ');
      },
      error: (error: any) => {
        console.error('Failed to send status change review email:', error);
      }
    });
  }

  private getStatusName(statusId: any): string {
    if (!statusId) return 'Open';

    if (typeof statusId === 'string') {
      return statusId;
    }

    const status = this.RiskStatuses.find(s => s.id === Number(statusId));
    return status ? status.name : 'Open';
  }
}
