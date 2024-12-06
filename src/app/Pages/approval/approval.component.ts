import { Component } from '@angular/core';
import { ViewRiskComponent } from "../view-risk/view-risk.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { RiskBasicDetailsCardComponent } from "../../Components/risk-basic-details-card/risk-basic-details-card.component";
import { RiskDetailsSection2Component } from "../../Components/risk-details-section2/risk-details-section2.component";

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [ViewRiskComponent, BodyContainerComponent, RiskBasicDetailsCardComponent, RiskDetailsSection2Component],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent {

}
