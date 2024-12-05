import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overall-rating-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overall-rating-card.component.html',
  styleUrl: './overall-rating-card.component.scss'
})
export class OverallRatingCardComponent {


  @Input() value="";
  numericValue: number=40;

  ngOnInit() {
    this.numericValue = +this.value; // Convert to a number
  }

  @Input() title="";

}
