import { Component } from '@angular/core';
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
  riskData:any=''
  riskType:string='Quality'
  riskId:number=0
  ngOnInit(){
    // this. riskdata=history.state.riskData ;
    // this.riskType=this.riskdata.risk_type;
    // console.log(this.riskdata)
    this.riskData = history.state.riskData;
    this.riskId=this.riskData.id
    this.riskType=this.riskData.riskType

  }

}
