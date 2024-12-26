import { Component } from '@angular/core';
import { QmsEditComponent } from "../../Components/qms-edit/qms-edit.component";
import { IsmsEditComponent } from "../../Components/isms-edit/isms-edit.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";


@Component({
  selector: 'app-edit-risk',
  standalone: true,
  imports: [QmsEditComponent, IsmsEditComponent, BodyContainerComponent],
  templateUrl: './edit-risk.component.html',
  styleUrl: './edit-risk.component.scss'
})
export class EditRiskComponent {
  riskdata:any=''
  riskType:string='Quality'
  ngOnInit(){
    // this. riskdata=history.state.riskData ;
    // this.riskType=this.riskdata.risk_type;
    // console.log(this.riskdata)

  }

}
