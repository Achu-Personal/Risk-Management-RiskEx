import { Component } from '@angular/core';
import { QmsEditComponent } from "../../Components/qms-edit/qms-edit.component";
import { IsmsEditComponent } from "../../Components/isms-edit/isms-edit.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { QMSFormComponent } from "../../Components/qms-form/qms-form.component";
import { ISMSFormComponent } from "../../Components/isms-form/isms-form.component";


@Component({
  selector: 'app-edit-risk',
  standalone: true,
  imports: [BodyContainerComponent, ISMSFormComponent, QMSFormComponent],
  templateUrl: './edit-risk.component.html',
  styleUrl: './edit-risk.component.scss'
})
export class EditRiskComponent {
  riskdata:any=''
  riskType:string=''
  ngOnInit(){
    this. riskdata=history.state.riskData ;
    this.riskType=this.riskdata.risk_type;
    console.log(this.riskdata)

  }

}
