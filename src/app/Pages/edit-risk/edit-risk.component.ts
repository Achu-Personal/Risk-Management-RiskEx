import { Component } from '@angular/core';
import { QmsEditComponent } from "../../Components/qms-edit/qms-edit.component";
import { IsmsEditComponent } from "../../Components/isms-edit/isms-edit.component";

@Component({
  selector: 'app-edit-risk',
  standalone: true,
  imports: [QmsEditComponent, IsmsEditComponent],
  templateUrl: './edit-risk.component.html',
  styleUrl: './edit-risk.component.scss'
})
export class EditRiskComponent {


  riskType:string='Security'

  ngOnInit()
  {
    let riskData = history.state.riskData;

    this.riskType=riskData.risk_type
    console.log("data==",this.riskType)
  }

}
