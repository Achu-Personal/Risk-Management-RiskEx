import { Component, computed, effect, Input } from '@angular/core';
import { LikelihoodImpactCardComponent } from "../../UI/likelihood-impact-card/likelihood-impact-card.component";
import { PrivacySecurityRiskAssessment } from '../../Interfaces/RiskInterFaces.interface';
import { OverallRatingCardComponent } from '../../UI/overall-rating-card/overall-rating-card.component';
import { GlobalStateServiceService } from '../../Services/global-state-service.service';

@Component({
  selector: 'app-risk-details-section3-mitigation',
  standalone: true,
  imports: [LikelihoodImpactCardComponent,OverallRatingCardComponent],
  templateUrl: './risk-details-section3-mitigation.component.html',
  styleUrl: './risk-details-section3-mitigation.component.scss'
})
export class RiskDetailsSection3MitigationComponent {

  @Input() title=""
  // @Input() beforeMitigation!:PrivacySecurityRiskAssessment;
  // @Input() afterMitigation!:PrivacySecurityRiskAssessment;


  //here it is any because Two types of data can come. one that of  privacySecurity  and quality
  @Input() beforeMitigation!:any;
  @Input() afterMitigation!:any;
  @Input() type=""

  @Input() status:string="";

  sharedData = computed(() => this.sharedDataService.data());
  approvalMessage: string = '';

  constructor(private sharedDataService: GlobalStateServiceService)
  {
    effect(() => {
      console.log(this.sharedData());
    });
  }
 
  ngOnInit(): void {
    const data = this.sharedData();
    if (data && data.approve) {
      this.approvalMessage = data.approve; // Extract the message
    }
  }
}
