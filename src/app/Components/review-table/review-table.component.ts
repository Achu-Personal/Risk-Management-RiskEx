import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-review-table',
  standalone: true,
  imports: [],
  templateUrl: './review-table.component.html',
  styleUrl: './review-table.component.scss'
})
export class ReviewTableComponent {
@Input() TableHeader:any;
@Input() TableBody:any;

}
