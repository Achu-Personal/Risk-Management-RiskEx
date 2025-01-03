import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { UpdateQmsComponent } from "../../Components/update-qms/update-qms.component";
import { UpdateIsmsComponent } from "../../Components/update-isms/update-isms.component";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update-risk',
  standalone: true,
  imports: [BodyContainerComponent, UpdateQmsComponent, UpdateIsmsComponent],
  templateUrl: './update-risk.component.html',
  styleUrl: './update-risk.component.scss'
})
export class UpdateRiskComponent {


riskId: string='';
riskType: string='';
constructor(private route: ActivatedRoute) {}

ngOnInit(){
  this.route.queryParams.subscribe(params =>{
    this.riskId = params['riskId'];
    this.riskType = params['riskType'];

    // You can now use these values (riskId, riskType) in your component
    console.log('Risk ID:', this.riskId);
    console.log('Risk Type:', this.riskType);
  });


}

}
