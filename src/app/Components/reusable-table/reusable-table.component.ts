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
rejectRisk = output();  
rejectButton(event:Event) {
  event.stopPropagation();
  this.rejectRisk.emit();
  
}
approveRisk = output();
approveButton(event:Event) {
    event.stopPropagation();
    this.approveRisk.emit();
 
  
}

  @Input() tableHeaders: string[] = []; 
  @Input() tableData: any[] = []; 
  @Input() IsActionRequiered: boolean = true;

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
      
}
