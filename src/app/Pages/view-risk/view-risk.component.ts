import { Component } from '@angular/core';
import { RiskBasicDetailsCardComponent } from "../../Components/risk-basic-details-card/risk-basic-details-card.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { RiskDetailsSection2Component } from "../../Components/risk-details-section2/risk-details-section2.component";

@Component({
  selector: 'app-view-risk',
  standalone: true,
  imports: [RiskBasicDetailsCardComponent, BodyContainerComponent, RiskDetailsSection2Component],
  templateUrl: './view-risk.component.html',
  styleUrl: './view-risk.component.scss'
})
export class ViewRiskComponent {

}
