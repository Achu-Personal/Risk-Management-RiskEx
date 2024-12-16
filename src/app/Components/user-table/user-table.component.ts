import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent {

  @Input() items:any[]=[];
  @Input() itemslist:any[]=[];

}
