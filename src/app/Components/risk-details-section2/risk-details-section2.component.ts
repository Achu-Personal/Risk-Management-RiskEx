import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-risk-details-section2',
  standalone: true,
  imports: [],
  templateUrl: './risk-details-section2.component.html',
  styleUrl: './risk-details-section2.component.scss'
})
export class RiskDetailsSection2Component {


  @Input() riskMitigation=""
  @Input() riskContengency=""
  @Input() responsibilityOfAction=""
  @Input() plannedActionDate=""


}
