import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-likelihood-impact-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-likelihood-impact-tooltip.component.html',
  styleUrl: './form-likelihood-impact-tooltip.component.scss'
})
export class FormLikelihoodImpactTooltipComponent {
  @Input() showModal: boolean = false;
  @Input() tableType: string = '';
  @Output() closeRiskModal = new EventEmitter<void>();

  likelihoodHeader = ['Likelihood', 'Definitions', 'Chance of Occurrence'];
  likelihoodRows = [
    ['Low', 'The probability of the risk occurring is minimal, with little to no historical evidence or indication of occurrence.(Once in 3 Years)', '<=10%'],
    ['Medium', 'There is a moderate probability of the risk occurring. It may have occurred in the past under similar circumstances(Once a year)', '10-50%'],
    ['High', 'The probability of the risk occurring is significant, and it is likely to happen based on historical trends or current conditions.(Once a quarter)', '50-90%'],
    ['Critical', 'The risk is almost certain to occur, with a very high probability of materializing(Once a month)', '≥90%']
  ];

  impactHeader = ['Impact', 'Definitions'];
  impactRows = [
    ['Low', 'The consequences of the risk are minimal, with negligible effects on the organization’s operations, finances, or reputation.'],
    ['Medium', 'The consequences of the risk are moderate, causing some disruption or financial loss, but manageable without significant impact on key objectives.'],
    ['High', 'The consequences of the risk are significant, causing major disruptions, substantial financial losses, or harm to the organization’s reputation.'],
    ['Critical', 'The consequences of the risk are severe, potentially threatening the organization’s ability to operate or causing irreparable harm.']
  ];

  close() {
    this.closeRiskModal.emit();
  }

}
