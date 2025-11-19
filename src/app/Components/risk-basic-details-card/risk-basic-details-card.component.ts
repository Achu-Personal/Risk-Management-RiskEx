import { ChangeDetectorRef, Component, EventEmitter, Input, input, Output } from '@angular/core';
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { RiskStatusCardComponent } from "../../UI/risk-status-card/risk-status-card.component";
import { EditButtonComponent } from "../../UI/edit-button/edit-button.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth/auth.service';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-risk-basic-details-card',
  standalone: true,
  imports: [OverallRatingCardComponent, RiskStatusCardComponent, EditButtonComponent, CommonModule],
  templateUrl: './risk-basic-details-card.component.html',
  styleUrl: './risk-basic-details-card.component.scss'
})
export class RiskBasicDetailsCardComponent {

  constructor(public router: Router, public authService: AuthService, public api: ApiService, private cdr: ChangeDetectorRef) {

  }
  @Output() editClicked = new EventEmitter<boolean>();

  color = 'red';

  showPopupForUpdateStatus = false;
  ismitigatedRisk: boolean = false;

  ngOnInit() {
    this.api.getReviewSatus(this.allData.id, false).subscribe((e) => {

      this.postReviewstatus = e
      // console.log("review statushhhhhhh uuuuuu",this.postReviewstatus);
      this.cdr.detectChanges()
    })

    this.api.getReviewSatus(this.allData.id, true).subscribe((e) => {

      this.preReviewstatus = e
      //  console.log("review statushhhhhhh",e);
      this.cdr.detectChanges()
    })
    // console.log("is admin",this.authService.getUserRole());
    if (this.allData.riskType == "Quality") {
      this.isQualityRisk = true;

    }
    console.log("allData", this.allData);

    if (this.allData.riskType == "Quality" && this.allData.riskAssessments.length > 1) {
      this.ismitigatedRisk = true;
      console.log("ismitigatedRisk", this.ismitigatedRisk);
    }
    else if (this.allData.riskType == "Security" && this.allData.riskAssessments.length > 4) {
      this.ismitigatedRisk = true;
      console.log("ismitigatedRisk", this.ismitigatedRisk);
    }
    else if (this.allData.riskType == "Privacy" && this.allData.riskAssessments.length > 4) {
      this.ismitigatedRisk = true;
      console.log("ismitigatedRisk", this.ismitigatedRisk);

    }
    else {
      console.log("ismitigatedRisk is lesssss", this.ismitigatedRisk);
    }

    if (this.allData.riskAssessments[0].review.reviewStatus !== "ApprovalCompleted") {
      this.isreviewCompleted = false; // Reviews are NOT completed (i.e., pending)
    } else {
      this.isreviewCompleted = true;  // Reviews ARE completed
    }



  }
  isQualityRisk: boolean = false;
  isreviewCompleted = false;


  @Input() isEditable = true;
  @Input() allData: any = {
    "id": null,
    "riskId": " ",
    "riskName": " ",
    "description": " ",
    "impact": " ",
    "isoClauseNumber": "",
    "mitigation": " ",
    "contingency": " ",
    "overallRiskRating": null,
    "overalRiskRatingBefore": null,
    "plannedActionDate": " ",
    "remarks": " ",
    "riskStatus": "",
    "riskType": " ",
    "riskResponse": " ",
    "riskAssessments": [],
    "responsibleUser": {
      "id": null,
      "fullName": "",
      "email": ""
    },
    "department": {
      "id": null,
      "name": "",
      "departmentCode": null
    },
    "project": null,
    "residualValue": null,
    "percentageRedution": null,
    "residualRisk": "",
    "createdBy": {
      "id": null,
      "fullName": "",
      "email": ""
    },
    "createdAt": "",
    "updatedBy": {
      "id": null,
      "fullName": "",
      "email": ""
    },
    "updatedAt": "",
    "closedDate": "",

  }


  @Input() preReviewstatus: any = null
  @Input() postReviewstatus: any = null

  onEditButtonClicked() {
    // console.log("id",this.allData.id);

    this.router.navigate([`edit`], { state: { riskData: this.allData } }) ///ViewRisk/${this.allData.id}/
  }

  onUpdateButtonCLick() {
    // console.log("id",this.allData.id);

    this.router.navigate(['update'], { queryParams: { riskId: this.allData.id, riskType: this.allData.riskType, overallRiskRatingBefore: this.allData.overalRiskRatingBefore } }); //         /ViewRisk/${this.allData.id}
  }


  onEditIconClicked() {
    this.showPopupForUpdateStatus = true;

    console.log("showPopupForUpdateStatus", this.showPopupForUpdateStatus);
    this.editClicked.emit(this.showPopupForUpdateStatus);
  }



}
