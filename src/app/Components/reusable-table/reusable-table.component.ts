import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss'
})
export class ReusableTableComponent {
  @Input() tableHeaders: string[] = []; 
  @Input() tableData: any[] = []; 

  rowKeys: string[] = []; 

  ngOnInit(): void {
    if (this.tableData && this.tableData.length > 0) {
      this.rowKeys = Object.keys(this.tableData[0]); 
    }
  }
}
