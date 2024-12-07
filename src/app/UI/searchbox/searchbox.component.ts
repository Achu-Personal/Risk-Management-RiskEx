import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-searchbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './searchbox.component.html',
  styleUrl: './searchbox.component.scss'
})
export class SearchboxComponent {


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
