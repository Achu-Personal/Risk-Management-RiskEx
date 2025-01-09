import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';

@Component({
  selector: 'app-form-successfull',
  standalone: true,
  imports: [CommonModule,StyleButtonComponent],
  templateUrl: './form-successfull.component.html',
  styleUrl: './form-successfull.component.scss'
})
export class FormSuccessfullComponent {
  @Input() message: string = 'Operation completed successfully!';
  @Input() isSuccessfull:boolean=true

  @Input() HeaderMessage:string=''


  @Output() closeDialog = new EventEmitter<void>();
  constructor(private el: ElementRef){}





  close() {
    this.closeDialog.emit();
  }
}
