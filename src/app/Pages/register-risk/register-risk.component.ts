import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { QMSFormComponent } from "../../Components/qms-form/qms-form.component";
import { ISMSFormComponent } from "../../Components/isms-form/isms-form.component";


@Component({
  selector: 'app-register-risk',
  standalone: true,
  imports: [BodyContainerComponent, QMSFormComponent, ISMSFormComponent],
  templateUrl: './register-risk.component.html',
  styleUrl: './register-risk.component.scss'
})
export class RegisterRiskComponent {

selectedRiskType: number = 1;

riskTypes=[
 { "type": "Quality","value": 1 },
 { "type": "Security","value": 2 },
 { "type": "Privacy","value": 3 }
];

setRiskType(riskValue: number){
  this.selectedRiskType = riskValue;
}
}
