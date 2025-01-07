import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-risk-response',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form-risk-response.component.html',
  styleUrl: './form-risk-response.component.scss'
})
export class FormRiskResponseComponent {
@Input() riskResponses:Array<{ id: number; name: string; description: string; example: string; risks:string }> = [];
@Output() selectedValueChange = new EventEmitter<any>();
@Input() label:string=''
@Input() required:string=''
@Input() bgColor:string=''

selectedResponse: any = null

constructor(private el: ElementRef){}
ngOnInit(){

  this.el.nativeElement.style.setProperty('--bg-color', this.bgColor);

}

onRadioChange(event: any) {
  this.selectedValueChange.emit(this.selectedResponse);
  console.log("selecetd value:",this.selectedResponse);



}
}
