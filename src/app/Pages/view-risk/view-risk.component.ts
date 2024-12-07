import { Component, Input } from '@angular/core';
import { RiskBasicDetailsCardComponent } from "../../Components/risk-basic-details-card/risk-basic-details-card.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { RiskDetailsSection2Component } from "../../Components/risk-details-section2/risk-details-section2.component";
import { RiskDetailsSection3MitigationComponent } from "../../Components/risk-details-section3-mitigation/risk-details-section3-mitigation.component";

@Component({
  selector: 'app-view-risk',
  standalone: true,
  imports: [RiskBasicDetailsCardComponent, BodyContainerComponent, RiskDetailsSection2Component, RiskDetailsSection3MitigationComponent],
  templateUrl: './view-risk.component.html',
  styleUrl: './view-risk.component.scss'
})
export class ViewRiskComponent {


  @Input() data= {
    sl_no: 1,
    risk_number: "R-001",
    risk_name:"Unauthorized access to sensitive data",
    risk_description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
    risk_type: "Security",
    department_id: "DPT-001",
    project_id: "PRJ-1001",
    impact_of_risk: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC",
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
    risk_mitigation: "Implementing multi-factor authentication (MFA) and encryption is crucial to enhancing security in any system. MFA ensures that users provide two or more verification factors to gain access, reducing the risk of unauthorized access. Encryption, on the other hand, protects sensitive data by transforming it into an unreadable format, only accessible by those with the correct decryption key. Together, these measures provide a robust defense against data breaches and unauthorized activities",
    risk_contingency: "Restricting system access and enabling monitoring tools are essential practices for maintaining security and preventing unauthorized access. By limiting access to only authorized users, you reduce the risk of internal and external threats. Enabling monitoring tools allows for real-time tracking of system activity, helping to detect suspicious behavior or breaches early. These measures provide greater control over sensitive information and help ensure the integrity of your system’s operations and data",
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
