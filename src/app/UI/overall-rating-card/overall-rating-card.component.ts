import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overall-rating-card',
  standalone: true,
  imports: [],
  templateUrl: './overall-rating-card.component.html',
  styleUrl: './overall-rating-card.component.scss'
})
export class OverallRatingCardComponent {


  @Input() value="";
  @Input() title="";

}
