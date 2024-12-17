import { SlicePipe } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [SlicePipe,CommonModule,FormsModule],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss'
})
export class ReusableTableComponent {
rejectRisk = output();  
isToggled: boolean = false;
  // isActive: boolean;
rejectButton(event:Event,row:any) {
  console.log("Row",row);
  event.stopPropagation();
  this.rejectRisk.emit(row);
 
  
  
}
approveRisk = output();
approveButton(event:Event,row:any) {
    event.stopPropagation();
    this.approveRisk.emit(row);
 
  
}

  @Input() tableHeaders: string[] = []; 
  @Input() tableData: any[] = []; 
  @Input() IsActionRequiered: boolean = true;
  @Input() IsUser:boolean= false;


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
