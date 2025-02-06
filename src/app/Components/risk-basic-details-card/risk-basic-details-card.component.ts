import { ChangeDetectorRef, Component, Input, input } from '@angular/core';
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { RiskStatusCardComponent } from "../../UI/risk-status-card/risk-status-card.component";
import { EditButtonComponent } from "../../UI/edit-button/edit-button.component";
import {  Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UpdateButtonComponent } from "../../UI/update-button/update-button.component";
import { AuthService } from '../../Services/auth.service';
import { ApiService } from '../../Services/api.service';
import { OneDirective } from '../../Directives/one.directive';

@Component({
  selector: 'app-risk-basic-details-card',
  standalone: true,
  imports: [OverallRatingCardComponent, RiskStatusCardComponent, EditButtonComponent, CommonModule, UpdateButtonComponent, OneDirective],
  templateUrl: './risk-basic-details-card.component.html',
  styleUrl: './risk-basic-details-card.component.scss'
})
export class RiskBasicDetailsCardComponent {

  constructor(public router :Router,public authService:AuthService,public api:ApiService,private cdr: ChangeDetectorRef)
  {

  }

  color='red';

  ngOnInit()
  {
    this.api.getReviewSatus(this.allData.id,true).subscribe((e)=>{

      this.Reviewstatus=e
      console.log("review status",e);
      this.cdr.detectChanges()
    })
  }

  @Input() riskNumber=""
  @Input()riskType=""
  @Input() riskDesc=""
   @Input() riskName=""

  @Input() overallRiskRating:number=0
  @Input() riskStatus=""
  @Input() isEditable=true;
  @Input() allData:any={}

  @Input() Reviewstatus:any={}




  onEditButtonClicked()
  {
    console.log("id",this.allData.id);

    this.router.navigate([`edit`], { state: { riskData: this.allData } }) //         /ViewRisk/${this.allData.id}/
  }

  onUpdateButtonCLick()
  {
    console.log("id",this.allData.id);

    this.router.navigate(['update'], { queryParams: {riskId:this.allData.id ,riskType:this.riskType,overallRiskRatingBefore:this.overallRiskRating} }); //         /ViewRisk/${this.allData.id}
  }

}
