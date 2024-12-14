import { SlicePipe } from '@angular/common';
import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [SlicePipe],
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
  onclickrow = output()
  rowClick(row:any) {
    this.onclickrow.emit(row);
    }
    // truncateWords(text: string, wordLimit: number): string {
    //   if (!text) return ''; // Handle empty or undefined text
    //   const words = text.split(' ');
    //   return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
    // }
      
}
