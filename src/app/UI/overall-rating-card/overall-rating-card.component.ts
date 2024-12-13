import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-overall-rating-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overall-rating-card.component.html',
  styleUrl: './overall-rating-card.component.scss'
})
export class OverallRatingCardComponent {


  @Input() value="";
  @Input() title="";
  @Input() backgroundColor=""
  numericValue: number=40;
  @Input() height:number=33;
  @Input() width:number=33;
  @Input() textColor:string=""

  ngOnInit() {
    this.numericValue = +this.value; // Convert to a number
  }



}
