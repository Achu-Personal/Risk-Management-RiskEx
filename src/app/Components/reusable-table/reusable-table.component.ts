import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { ApiService } from '../../Services/api.service';
import { PaginationComponent } from "../../UI/pagination/pagination.component";

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationPopupComponent, PaginationComponent],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss',
})
export class ReusableTableComponent {
  @Input() tableHeaders: string[] = [];
  @Input() tableData: any[] = [];
  @Input() IsActionRequiered: boolean = false;
  @Input() IsUser: boolean = false;
  @Input() height: any = '70%';
  @Input() IsAssignee: boolean = false;
  @Input() headerDisplayMap: any = this.tableHeaders;
  @Input() noDataMessage: string = 'No Data Available';
  @Input() isLoading: boolean = false;
  tableData1:any[]=[];
  isEyeOpen = false;
  isAdmin: boolean=false;
  isDepartmentUser=false;
  newState:boolean=true;
  showApproveDialog = false;
  showRejectDialog = false;
  currentRow: any;
  originalTableData: any[] = [];

  @Output() approveRisk = new EventEmitter<{ row: any; comment: string }>();
  @Output() rejectRisk = new EventEmitter<{ row: any; comment: string }>();

  constructor(
    public auth: AuthService,
    public api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    
  }

  rowKeys: string[] = [];

  ngOnInit(): void {

    const role = this.auth.getUserRole(); // Fetch user role
    this.isDepartmentUser = role === 'DepartmentUser';
    this.isAdmin = role === 'Admin';
    if (this.tableData && this.tableData.length > 0) {
      
      this.rowKeys = Object.keys(this.tableData[0]);
    }
  
  }
  ngOnChanges(changes: SimpleChanges) {
    // Check if tableData input has changed
    if (changes['tableData'] && changes['tableData'].currentValue) {
      // Store the original data whenever tableData changes
      this.originalTableData = [...changes['tableData'].currentValue];
      console.log('Original Table Data updated:', this.originalTableData);
    }
    if (changes['tableData'] ) {
      this.tableData1=[...this.tableData]
      console.log("tabledata1",this.tableData1)
      this.totalItems = this.tableData1.length;
      this.updatePaginatedItems();
      }
  }


  onToggleChange(row: any): void {
    this.newState = row.isActive;
    this.api.changeUserStatus(row.id, this.newState);
    console.log(`Row ID: ${row.fullName}, New State: ${this.newState}`);
    this.cdr.markForCheck();
  }

  rejectButton(event: Event, row: any) {
    event.stopPropagation();
    this.currentRow = row;
    this.showRejectDialog = true;
    this.cdr.markForCheck();
  }

  RiskClose(event: Event, row: any) {
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

  onApprove(data: { comment: string }) {
    this.approveRisk.emit({ row: this.currentRow, comment: data.comment });
    this.showApproveDialog = false;
    this.cdr.markForCheck();
  }

  onReject(data: { comment: string }) {
    this.rejectRisk.emit({ row: this.currentRow, comment: data.comment });
    this.showRejectDialog = false;
    this.cdr.markForCheck();
  }

  getRiskStatusClass(riskStatus: string): string {
    switch (riskStatus) {
      case 'open':
        return 'open';
      case 'close':
        return 'closed';
      default:
        return 'unknown';
    }
  }

  getRiskRatingStyle(riskRating: number): string {
    if (riskRating < 30) {
      return 'green-risk';
    } else if (riskRating > 31 && riskRating < 99) {
      return 'yellow-risk';
    } else {
      return 'red-risk';
    }
  }

  onclickrow = output();
  rowClick(row: any) {
    this.onclickrow.emit(row);
    }
    // ngOnChanges(changes: SimpleChanges): void {
    //   // console.log('Table Headers:', this.tableHeaders);
    //   // console.log('Table Data:', this.tableData);
    //   if (changes['tableData'] ) {
    //     this.tableData1=[...this.tableData]
    //     console.log("tabledata1",this.tableData1)
    //     this.totalItems = this.tableData1.length;
    //     this.updatePaginatedItems();
    //     }
    // }

  hasValidData(): boolean {
    return (
      this.tableData &&
      this.tableData.length > 0 &&
      this.tableData.some((row) => row.riskName || row.riskId || row.fullName)
    );
  }

  table:any[]=[];
  itemsPerPage = 10;
  currentPage = 1;
  totalItems: number = 0;
  shouldDisplayPagination(): boolean {
    console.log("lenght",this.tableData1.length)
    return this.tableData1.length > this.itemsPerPage;
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedItems();
  }

  updatePaginatedItems(): void {
    // console.log("insie",this.tableData1)
    const startIndex = (this.currentPage -1 ) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.tableData = this.tableData1.slice(startIndex, endIndex);
    // this.tableData=[...this.table];
    console.log("insie",this.tableData)
    this.totalItems = this.tableData1.length;
    console.log("totalitems:",this.totalItems)
    this.cdr.markForCheck();
  }
  //-----------------filter ----------------------//

  showFilterDropdown = false;
  currentFilterColumn: string | null = null;
  filterSearchText = '';
  activeFilters: { [key: string]: string } = {};
  // originalTableData: any[] = []

  toggleFilter(event: Event, header: string) {
    event.stopPropagation();

    if (this.currentFilterColumn === header && this.showFilterDropdown) {
      this.showFilterDropdown = false;
      this.currentFilterColumn = null;
    } else {
      this.showFilterDropdown = true;
      this.currentFilterColumn = header;
      this.filterSearchText = '';
    }
  }

  // Get unique values for the current column
  getColumnValues(column: string): string[] {
    const uniqueValues = [...new Set(this.originalTableData.map((row) => row[column]))];
    return ['Select All', ...uniqueValues].filter(Boolean);
  }

  // Get filtered options based on search text
  getFilteredOptions(): string[] {
    if (!this.currentFilterColumn) return [];

    const options = this.getColumnValues(this.currentFilterColumn);
    if (!this.filterSearchText) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(this.filterSearchText.toLowerCase())
    );
  }

  searchFilterOptions() {
    // This will trigger a re-render of the filtered options
  }

  applyFilter(column: string, value: string) {
    if (value === 'Select All') {
      delete this.activeFilters[column]; // Clear the filter for this column
  
    } else {
      this.activeFilters[column] = value; // Apply the specific filter
      

    }
    this.filterData();
    this.showFilterDropdown = false;
    this.currentFilterColumn = null;
  }

  clearFilter(column: string) {
    delete this.activeFilters[column];
    this.filterData();
  }

  private filterData() {
    // Start with original data
    let filteredData = [...this.originalTableData];

     // Apply all active filters
     if (Object.keys(this.activeFilters).length > 0) {
      Object.entries(this.activeFilters).forEach(([column, value]) => {
        filteredData = filteredData.filter((row) => row[column] === value);
      });
    }


    this.tableData = filteredData;
  }
 
  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;

    // Check if the click was inside the filter dropdown or toggle button
    if (
      this.showFilterDropdown &&
      !targetElement.closest('.filter-dropdown') &&
      !targetElement.closest('.filter-icon')
    ) {
      this.showFilterDropdown = false;
      this.currentFilterColumn = null;
    }
  }
}
