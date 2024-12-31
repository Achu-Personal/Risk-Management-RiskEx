import { Component, Input } from '@angular/core';
import { Step } from '../../Interfaces/Stepper.interface';


@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {


  currentStep = 1;
  @Input() steps: Step[] = [
    {
      id: 1,
      title: 'Open',
      isCompleted: false,
      actionBy: 'Sreehari',
      date: '21 June 2024',
      stepNumber: '01'
    },
    {
      id: 2,
      title: 'review',
      isCompleted: false,
      actionBy: 'Tony',
      date: '22 June 2024',
      stepNumber: '02'
    },
    {
      id: 3,
      title: 'Mitigation',
      isCompleted: false,
      actionBy: 'Akshay',
      date: '23 June 2024',
      stepNumber: '03'
    },
    {
      id: 4,
      title: 'Post Review',
      isCompleted: false,
      actionBy: 'Tony',
      date: '23 June 2024',
      stepNumber: '04'
    },
    {
      id: 5,
      title: 'Closed',
      isCompleted: false,
      actionBy: 'Tony',
      date: '23 June 2024',
      stepNumber: '05'
    }
  ];

  ngOnInit() {

    this.completeStep(1);
    this.completeStep(2);
  }

  completeStep(stepId: number) {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.isCompleted = true;


      if (stepId < this.steps.length) {
        this.currentStep = stepId + 1;
      }
    }
  }


  completeUntilStep(stepId: number) {
    this.steps.forEach(step => {
      if (step.id <= stepId) {
        step.isCompleted = true;
      } else {
        step.isCompleted = false;
      }
    });
    this.currentStep = stepId + 1;
  }


  resetStepper() {
    this.steps.forEach(step => step.isCompleted = false);
    this.currentStep = 1;
    this.completeStep(1);
  }

}
