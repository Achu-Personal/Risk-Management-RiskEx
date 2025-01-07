import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [],
  templateUrl: './approved-response.component.html',
  styleUrl: './approved-response.component.scss'
})
export class ThankyouComponent {
  constructor(private api:ApiService,private route: ActivatedRoute) {
    
  }
  riskId:number = 0;
  approvalStatus: string | null = null;
ngOnInit(){
  // this.api.updateRiskReviewStatus(riskId: number, approvalStatus: string)
  const idParam = this.route.snapshot.paramMap.get('id');
    this.riskId = idParam ? +idParam : 0;
    this.approvalStatus="Approved"
    const updates=
      {
        "riskId": this.riskId,
        "approvalStatus": "Approved"
      }
    
    this.api.updateExternalReivewStatus(updates).subscribe((e)=>console.log(e)
    );
    console.log('Risk ID:', this.riskId);
    console.log('Approval Status', this.approvalStatus);
    
}
}
