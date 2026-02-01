import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  Output,
  OnInit,
  KeyValueDiffers,
  KeyValueDiffer,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Step } from '../../Interfaces/Stepper.interface';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'], // Corrected "styleUrl" to "styleUrls"
})
export class StepperComponent {
  @Output() stepCompleted = new EventEmitter<number>();
  @Input() steps: Step[] = [];
  @Input() isExpandedView!: boolean;
  myListDiffer?: KeyValueDiffer<string, any>;
  currentStep = 1;
  @ViewChild('expandedView') expandedView!: ElementRef;


  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['steps'] && this.steps) {
  //     this.steps.forEach((step) => {
  //       if (step.isCompleted) {
  //         this.emitStepCompleted(step.id);
  //       }
  //     });
  //   }
  // }
  constructor(
    private differs: KeyValueDiffers,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['steps']) {
      // Handle initial changes or significant list modifications
      // console.log('steps changed:', this.steps);
      this.myListDiffer = this.differs.find(this.steps).create();
    }

     if (this.isExpandedView) {
    setTimeout(() => {
      this.expandedView.nativeElement
        .querySelector('.pending')
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }
  }

  ngDoCheck() {
    if (this.myListDiffer) {
      const changes = this.myListDiffer.diff(this.steps);
      if (changes) {
        changes.forEachChangedItem((change) => {
          console.log(`Object with id ${change.key} changed:`);
          console.log('Previous Value:', change.previousValue);
          console.log('Current Value:', change.currentValue);
          // Handle specific property changes within the object
        });
      }
      //  console.log('stepsafter=', this.steps);
      this.steps.forEach((e: any) => {
        if (e.isCompleted) {
          this.completeStep(e.id);
        }
      });
    }
  }

  ngOnInit() {
    console.log('stepssssssssssssssssss=', this.steps);
    setTimeout(() => {
      this.steps.forEach((e: any) => {
        if (e.isCompleted) {
          this.completeStep(e.id);
        }
      });
    }, 1000);
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

  get currentStepIndex(): number {
  return this.steps.findIndex(s => !s.isCompleted);
}

get progressPercent(): number {
  if (this.currentStepIndex === -1) return 100;
  return (this.currentStepIndex / (this.steps.length - 1)) * 100;
}

get allStepsCompleted(): boolean {
  return this.steps.every(s => s.isCompleted);
}




}
