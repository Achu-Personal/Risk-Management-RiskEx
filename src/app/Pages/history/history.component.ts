import { Component } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

}
