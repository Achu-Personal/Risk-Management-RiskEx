import { Component, Input, SimpleChanges, OnChanges, EventEmitter, Output, OnInit } from '@angular/core';
import { Step } from '../../Interfaces/Stepper.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'], // Corrected "styleUrl" to "styleUrls"
})
export class StepperComponent implements OnChanges {
  @Output() stepCompleted = new EventEmitter<number>();
  @Input() steps: Step[] = [];
  currentStep = 1;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['steps'] && this.steps) {
      this.steps.forEach((step) => {
        if (step.isCompleted) {
          this.emitStepCompleted(step.id);
        }
      });
    }
  }

  completeStep(stepId: number) {
    const step = this.steps.find((s) => s.id === stepId);
    if (step) {
      step.isCompleted = true;
      if (stepId < this.steps.length) {
        this.currentStep = stepId + 1;
      }
      this.emitStepCompleted(stepId);
    }
  }

  private emitStepCompleted(stepId: number) {
    this.stepCompleted.emit(stepId);
  }
}
