import { ChangeDetectorRef, Component, Input, input } from '@angular/core';
import { StepperComponent } from "../../UI/stepper/stepper.component";
import { CommonModule } from '@angular/common';
import { Step } from '../../Interfaces/Stepper.interface';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-risk-details-section2',
  standalone: true,
  imports: [StepperComponent, CommonModule],
  templateUrl: './risk-details-section2.component.html',
  styleUrl: './risk-details-section2.component.scss'
})
export class RiskDetailsSection2Component {
  @Input() data: any = null;

  currentStep = 1;
  constructor(private api: ApiService, private route: ActivatedRoute,private cdRef: ChangeDetectorRef) {

  }



  stepperData: Step[] = [
    {
      id: 1,
      title: 'Open',
      isCompleted: false,
      actionBy: '...',
      date: '...',
      stepNumber: '01',
      message: ""
    },
    {
      id: 2,
      title: 'Review',
      isCompleted: false,
      actionBy: '...',
      date: '...',
      stepNumber: '02',
      message: ""
    },
    {
      id: 3,
      title: 'Mitigation',
      isCompleted: false,
      actionBy: '....',
      date: '...',
      stepNumber: '03',
      message: ""
    },
    {
      id: 4,
      title: 'Post Review',
      isCompleted: false,
      actionBy: '...',
      date: '...',
      stepNumber: '04',
      message: ""
    },
    // {
    //   id: 5,
    //   title: this.data.riskStatus,
    //   isCompleted: false,
    //   actionBy: '...',
    //   date: '...',
    //   stepNumber: '05',
    //     message:""
    // }
  ]

  ngOnInit() {
    // console.log('Datsssssssssa=', this.data);

    var mitigationCard = document.getElementById("mitigationCard")
    var contingencyCard = document.getElementById("mitigationCard")

    if (this.data) {
      this.stepperData.push({
        id: 5,
        title: this.data.RiskStatus?.toLowerCase() === 'open' ? 'Close' : this.data.RiskStatus || 'Unknown',
        isCompleted: false,
        actionBy: '...',
        date: '...',
        stepNumber: '05',
        message: ""
      });
    }


    setTimeout(() => {
      // console.log('Datsssssssssa=', this.data);
      this.route.paramMap.subscribe((params) => {
        let id = params.get('id');

        this.api.getReviewSatus(id!, true).subscribe((e: any) => {
          // console.log('ReviewSatusy', e);


          this.stepperData[0].actionBy = this.data.CreatedBy;
          this.stepperData[0].isCompleted = true;
          this.stepperData[0].date = this.data.CreatedAt;
          this.stepperData[0].message = "";

          this.stepperData[1].actionBy = e.actionBy;
          this.stepperData[1].isCompleted = e.isReviewed >= 2 ? true : false;
          this.stepperData[1].date = e.isReviewed >= 2 ? e.date : "...";
          this.stepperData[1].message = e.isReviewed != 5 ? (e.isReviewed >= 2 ? "(Accepted)" : '') : `(Rejected)`;

        });
        this.api.getMitigationSatus(id!).subscribe((e: any) => {
          // console.log('MitigationSatus', e);
          this.stepperData[2].actionBy = e.actionBy;
          this.stepperData[2].isCompleted = e.isMitigated;
          this.stepperData[2].date = e.isMitigated ? e.date : '...';
          this.stepperData[2].message = "";
        });


        this.api.getReviewSatus(id!, false).subscribe((e: any) => {
          // console.log('ReviewSatusafter', e);
          this.stepperData[3].actionBy = e.isReviewed >= 4 ? e.actionBy : '...';
          this.stepperData[3].isCompleted = e.isReviewed >= 4 ? true : false;
          this.stepperData[3].date = e.isReviewed >= 4 ? e.date : "...";
          this.stepperData[3].message = e.isReviewed != 5 ? (e.isReviewed >= 4 ? "(Accepted)" : '') : `(Rejected)`;


          // Step 5: Final Status - Handle all status types
          const normalizedStatus = this.data.RiskStatus?.toLowerCase();

          // List of statuses that indicate the risk has moved beyond "Open"
          const completedStatuses = ['closed', 'accepted', 'undertreatment', 'monitoring', 'deferred'];

          if (completedStatuses.includes(normalizedStatus) && e.isReviewed >= 4) {
            this.stepperData[4].actionBy = this.data.UpdatedBy || '...';
            this.stepperData[4].isCompleted = true;

            // Use ClosedDate if status is closed, otherwise use UpdatedAt
            this.stepperData[4].date = normalizedStatus === 'closed'
              ? (this.data.ClosedDate || this.data.UpdatedAt || '...')
              : (this.data.UpdatedAt || '...');

            this.stepperData[4].message = "";
          } else if (normalizedStatus !== 'open') {
            // For any other status that's not "Open", mark as incomplete but show some info
            this.stepperData[4].actionBy = '...';
            this.stepperData[4].isCompleted = false;
            this.stepperData[4].date = '...';
            this.stepperData[4].message = "";
          }

          this.cdRef.detectChanges();
        });


      });
    }, 1000)


  }


  // onStepCompleted(stepId: number) {
  //   console.log(`Step ${stepId} completed`);
  //   this.completeStep(stepId);
  // }

  completeStep(stepId: number) {
    const step = this.stepperData.find((s) => s.id === stepId);
    if (step) {
      step.isCompleted = true;
    }
  }
}
