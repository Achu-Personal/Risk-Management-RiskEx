import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

  @Input() title:string = 'get the app'
  @Input() bgColour:string = 'orange'
  @Input() height: string = '40';
  @Input() width: string = '100';
  @Input() routerLink: string ='';

  clicked= output()

  onClick(){
    this.clicked.emit();
  }
}
