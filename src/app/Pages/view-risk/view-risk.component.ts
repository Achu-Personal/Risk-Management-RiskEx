import { Component } from '@angular/core';
import { RiskBasicDetailsCardComponent } from "../../Components/risk-basic-details-card/risk-basic-details-card.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";

@Component({
  selector: 'app-view-risk',
  standalone: true,
  imports: [RiskBasicDetailsCardComponent, BodyContainerComponent],
  templateUrl: './view-risk.component.html',
  styleUrl: './view-risk.component.scss'
})
export class ViewRiskComponent {

}
