import { Component } from '@angular/core';
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { RiskStatusCardComponent } from "../../UI/risk-status-card/risk-status-card.component";

@Component({
  selector: 'app-risk-basic-details-card',
  standalone: true,
  imports: [OverallRatingCardComponent, RiskStatusCardComponent],
  templateUrl: './risk-basic-details-card.component.html',
  styleUrl: './risk-basic-details-card.component.scss'
})
export class RiskBasicDetailsCardComponent {

}
