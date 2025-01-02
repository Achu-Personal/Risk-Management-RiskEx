import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { UpdateQmsComponent } from "../../Components/update-qms/update-qms.component";
import { UpdateIsmsComponent } from "../../Components/update-isms/update-isms.component";

@Component({
  selector: 'app-update-risk',
  standalone: true,
  imports: [BodyContainerComponent, UpdateQmsComponent, UpdateIsmsComponent],
  templateUrl: './update-risk.component.html',
  styleUrl: './update-risk.component.scss'
})
export class UpdateRiskComponent {

riskdata:any=''
riskType:string='Security'

}
