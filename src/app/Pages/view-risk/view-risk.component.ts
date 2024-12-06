import { Component, Input } from '@angular/core';
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


  @Input() data= {
    sl_no: 1,
    risk_number: "R-001",
    risk_name:"Unauthorized access to sensitive data",
    risk_description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard",
    risk_type: "Security",
    department_id: "DPT-001",
    project_id: "PRJ-1001",
    impact_of_risk: {
      confidentiality: {
        likelihood: "Medium",
        impact: "High",
        risk_factor: 6
      },
      integrity: {
        likelihood: "Low",
        impact: "Medium",
        risk_factor: 3
      },
      availability: {
        likelihood: "Very Low",
        impact: "Medium",
        risk_factor: 2
      },
      overall_risk_rating: 11
    },
    current_risk_assessment: {
      confidentiality: {
        likelihood: "High",
        impact: "High",
        risk_factor: 9
      },
      integrity: {
        likelihood: "Medium",
        impact: "Low",
        risk_factor: 3
      },
      availability: {
        likelihood: "Low",
        impact: "Medium",
        risk_factor: 2
      },
      overall_risk_rating: 14
    },
    risk_mitigation: "Implement multi-factor authentication and encryption.",
    risk_contingency: "Restrict system access and enable monitoring tools.",
    responsibility_of_action: "IT Security Team",
    planned_action_date: "2024-12-10",
    assessment_post_implementation: {
      confidentiality: {
        likelihood: "Low",
        impact: "Medium",
        risk_factor: 3
      },
      integrity: {
        likelihood: "Very Low",
        impact: "Low",
        risk_factor: 1
      },
      availability: {
        likelihood: "Very Low",
        impact: "Low",
        risk_factor: 1
      },
      overall_risk_rating: 31
    },
    actual_closed_date: "2025-01-15",
    risk_response: "Mitigate",
    risk_status: "Closed",
    remarks: "Risk successfully mitigated through planned measures."
  };


}
