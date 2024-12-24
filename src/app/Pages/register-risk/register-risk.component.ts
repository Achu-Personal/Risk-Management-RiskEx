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

selectedRiskType: string = 'quality';

  setRiskType(type: string): void {
    this.selectedRiskType = type;
  }

}
