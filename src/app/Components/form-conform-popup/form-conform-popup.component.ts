import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';


@Component({
  selector: 'app-form-conform-popup',
  standalone: true,
  imports: [StyleButtonComponent],
  templateUrl: './form-conform-popup.component.html',
  styleUrl: './form-conform-popup.component.scss'
})
export class FormConformPopupComponent {
  @Input() message: string = 'Operation completed successfully!';

  @Output() closeDialog = new EventEmitter<void>();
  @Output() notCloseDialog = new EventEmitter<void>();
  constructor(private el: ElementRef) { }

  close() {
    this.closeDialog.emit();
  }
  notClose() {
    this.notCloseDialog.emit();
  }

}
