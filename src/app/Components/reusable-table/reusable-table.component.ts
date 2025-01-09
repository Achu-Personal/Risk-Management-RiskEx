// import { SlicePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { ConfirmationPopupComponent } from "../confirmation-popup/confirmation-popup.component";
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [ CommonModule, FormsModule, ConfirmationPopupComponent],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss'
})
export class ReusableTableComponent {

  @Input() tableHeaders: string[] = [];
  @Input() tableData: any[] = [];
  @Input() IsActionRequiered: boolean = false;
  @Input() IsUser:boolean= false;
  @Input() height:any='70%';
  @Input() IsAssignee:boolean = false;
  @Input() headerDisplayMap:any=this.tableHeaders;
  @Input() noDataMessage:string='No Data Available'
  @Input() isLoading: boolean = false;
  isEyeOpen = false;
  isAdmin: boolean=false;
  isDepartmentUser=false;
  newState:boolean=true;
  showApproveDialog = false;
  showRejectDialog = false;
  currentRow: any;



  @Output() approveRisk = new EventEmitter<{row: any, comment: string}>();
  @Output() rejectRisk = new EventEmitter<{row: any, comment: string}>();



  constructor(public auth:AuthService, public api:ApiService,private cdr: ChangeDetectorRef){}

  // SVG paths for eye states
  openEyePath = 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z';
  closedEyePath = 'M1 12s4-8 11-8 11 8 11 8M2 12h20';

  rowKeys: string[] = [];

  ngOnInit(): void {
    const role = this.auth.getUserRole(); // Fetch user role
    this.isDepartmentUser = role === 'DepartmentUser'
    this.isAdmin = role === 'Admin';
    if (this.tableData && this.tableData.length > 0) {
      this.rowKeys = Object.keys(this.tableData[0]);
    }


  }


onToggleChange(row: any): void {
  // newState = row.isActive ? true : false;
  this.newState = row.isActive;
  this.api.changeUserStatus(row.id,this.newState)
  console.log(`Row ID: ${row.fullName}, New State: ${this.newState}`);
  this.cdr.markForCheck();
}


rejectButton(event: Event, row: any) {
  event.stopPropagation();
  this.currentRow = row;
  this.showRejectDialog = true;
  this.cdr.markForCheck();
}

RiskClose(event:Event,row:any) {
    event.stopPropagation();
  this.rejectRisk.emit(row.riskId);
  this.cdr.markForCheck();
  }



approveButton(event: Event, row: any) {
  event.stopPropagation();
  this.currentRow = row;
  this.showApproveDialog = true;
  this.cdr.markForCheck();
}

onApprove(data: {comment: string}) {
  this.approveRisk.emit({row: this.currentRow,comment: data.comment});
  this.showApproveDialog = false;
  this.cdr.markForCheck();
}

onReject(data: {comment: string}) {
  this.rejectRisk.emit({row: this.currentRow,comment: data.comment});
  this.showRejectDialog = false;
  this.cdr.markForCheck();
}


formatDate(value: any): string {
  if (!value) return '';

  if (typeof value === 'string' && value.includes('-')) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  }
  return value;
}

//   If not a valid date, return the original value
//   return value.toString();
// }

getRiskType(riskType: number): string {
  switch (riskType) {
    case 1:
      return 'Quality';
    case 2:
      return 'Security';
    case 3:
      return 'Privacy';
    default:
      return 'Unknown';
  }
}
getRiskStatus(riskStatus:number) : string{
  switch(riskStatus){
    case 1:
      return 'Open';
    case 2:
      return 'Closed';
    default:
      return 'Unknown';
  }
}


getRiskStatusClass(riskStatus: string): string {
  switch (riskStatus) {
    case 'open':
      return 'open'; // Class for Open
    case 'close':
      return 'closed'; // Class for Closed
    default:
      return 'unknown'; // Class for unknown status
  }
}

getRiskRatingStyle(riskRating: number): string {
  if (riskRating < 30) {
    return 'green-risk'; // Green for risk rating < 30
  } else if (riskRating > 31 && riskRating < 99) {
    return 'yellow-risk'; // Yellow for risk rating between 31 and 99
  } else {
    return 'red-risk'; // Red for risk rating >= 99
  }
}


  onclickrow = output()
  rowClick(row:any) {

    this.onclickrow.emit(row);
    }
    ngOnChanges(changes: SimpleChanges): void {
      console.log('Table Headers:', this.tableHeaders);
      console.log('Table Data:', this.tableData);
    }

    hasValidData(): boolean {
      return this.tableData && this.tableData.length > 0 && this.tableData.some(row => row.riskName || row.riskId || row.fullName);
    }

   
    
}
