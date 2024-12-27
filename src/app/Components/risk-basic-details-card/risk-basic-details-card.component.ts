import { Component, Input, input } from '@angular/core';
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { RiskStatusCardComponent } from "../../UI/risk-status-card/risk-status-card.component";
import { EditButtonComponent } from "../../UI/edit-button/edit-button.component";
import {  Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-risk-basic-details-card',
  standalone: true,
  imports: [OverallRatingCardComponent, RiskStatusCardComponent, EditButtonComponent,CommonModule],
  templateUrl: './risk-basic-details-card.component.html',
  styleUrl: './risk-basic-details-card.component.scss'
})
export class RiskBasicDetailsCardComponent {

  constructor(public router :Router)
  {

  }


  @Input() riskNumber=""
  @Input()riskType=""
  @Input() riskDesc=""
   @Input() riskName=""

  @Input() overallRiskRating:number=0
  @Input() riskStatus=""
  @Input() isEditable=true;
  @Input() allData:any={}


  onEditButtonClicked()
  {
    console.log("id",this.allData.id);

      this.router.navigate([`edit`], { state: { riskData: this.allData } }) //         /ViewRisk/${this.allData.id}/
  }

}
