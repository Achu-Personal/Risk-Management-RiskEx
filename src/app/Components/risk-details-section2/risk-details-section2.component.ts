import { Component, Input } from '@angular/core';
import { StepperComponent } from "../../UI/stepper/stepper.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-risk-details-section2',
  standalone: true,
  imports: [StepperComponent,CommonModule],
  templateUrl: './risk-details-section2.component.html',
  styleUrl: './risk-details-section2.component.scss'
})
export class RiskDetailsSection2Component {


  @Input() riskMitigation=""
  @Input() riskContengency=""
  @Input() responsibilityOfAction=""
  @Input() plannedActionDate=""
  @Input() impact=""


}
