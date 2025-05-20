import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'newlineToBr'})
export class NewlineToBrPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/(?:\r\n|\r|\n)/g, '<br>');  
  }
}
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
