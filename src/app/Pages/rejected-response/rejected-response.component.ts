import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rejected-response',
  standalone: true,
  imports: [],
  templateUrl: './rejected-response.component.html',
  styleUrl: './rejected-response.component.scss'
})
export class RejectedResponseComponent {
constructor(private api:ApiService,private route: ActivatedRoute) {
    
  }
  riskId:number = 0;
  approvalStatus: string | null = null;
ngOnInit(){
  // this.api.updateRiskReviewStatus(riskId: number, approvalStatus: string)
  const idParam = this.route.snapshot.paramMap.get('id');
    this.riskId = idParam ? +idParam : 0;
    this.approvalStatus="Rejected"
    const updates=
      {
        "riskId": this.riskId,
        "approvalStatus": "Rejected"
      }
    
    this.api.updateExternalReivewStatus(updates).subscribe((e)=>console.log(e)
    );
    console.log('Risk ID:', this.riskId);
    console.log('Approval Status', this.approvalStatus);
    
}
}
