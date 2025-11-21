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
import { AuthService } from '../../Services/auth/auth.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { ApiService } from '../../Services/api.service';
import { PaginationComponent } from '../../UI/pagination/pagination.component';
import { SearchbarComponent } from '../../UI/searchbar/searchbar.component';
import { ActivatedRoute } from '@angular/router';
import { EditButtonComponent } from '../../UI/edit-button/edit-button.component';
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmationPopupComponent,
    PaginationComponent,
    SearchbarComponent,
    EditButtonComponent,
  ],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss',
})
export class ReusableTableComponent {
  @Input() tableHeaders: string[] = [];
  @Input() tableData: any[] = [];
  @Input() IsActionRequiered: boolean = false;
  @Input() IsUser: boolean = false;
  @Input() IsDraft: boolean = false;
  @Input() height: any = '65%';
  @Input() IsAssignee: boolean = false;
  @Input() headerDisplayMap: any = this.tableHeaders;
  @Input() noDataMessage: string = 'No Data Available';
  @Input() isLoading: boolean = false;

  draftEditButton = output();
  draftDeleteButton = output();

  originalTableData: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];

  isEyeOpen = false;
  isAdmin: boolean = false;
  isDepartmentUser = false;
  newState: boolean = true;
  showApproveDialog = false;
  showRejectDialog = false;
  currentRow: any;

  showStatusChangeDialog = false;
  currentToggleRow: any = null;
  previousToggleState: boolean = false;

  @Output() approveRisk = new EventEmitter<{ row: any; comment: string }>();
  @Output() rejectRisk = new EventEmitter<{ row: any; comment: string }>();
  @Output() editUserClicked = new EventEmitter<any>();

  constructor(
    public auth: AuthService,
    public api: ApiService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) { }

  rowKeys: string[] = [];
  isButtonVisible = false;
  ngOnInit(): void {
    const currentRoute = this.route.snapshot.url.join('/');
    if (currentRoute === 'users') {
      this.isButtonVisible = true;
    } else {
      this.isButtonVisible = false;
    }

    const role = this.auth.getUserRole();
    this.isDepartmentUser = role === 'DepartmentUser';
    this.isAdmin = role === 'Admin';
    if (this.tableData && this.tableData.length > 0) {
      this.initializeTableData();
    }
  }


  private initializeTableData(): void {
    if (!this.tableData || this.tableData.length === 0) {
      this.rowKeys = [];
      this.originalTableData = [];
      this.filteredData = [];
      this.paginatedData = [];
      this.totalItems = 0;
      return;
    }

    const allKeys = Object.keys(this.tableData[0]);


    if (this.tableHeaders && this.tableHeaders.length > 0) {
      this.rowKeys = this.tableHeaders.filter(header => allKeys.includes(header));
    } else {
      this.rowKeys = allKeys;
      this.tableHeaders = allKeys;
    }

    this.originalTableData = [...this.tableData].reverse();
    this.filteredData = [...this.originalTableData];
    this.currentPage = 1;
    this.totalItems = this.filteredData.length;
    this.updatePaginatedItems();
  }
  ngOnChanges(changes: SimpleChanges) {
     if (changes['tableData'] && changes['tableData'].currentValue) {
      this.initializeTableData();
    }
      if (changes['tableHeaders'] && changes['tableHeaders'].currentValue) {
      if (this.tableData && this.tableData.length > 0) {
        this.initializeTableData();
      }
    }
  }
  isSystemAdmin(row: any): boolean {
    return (
      row.fullName?.includes('System Admin') ||
      row.userName?.includes('System Admin') ||
      row.fullName === 'System Admin' ||
      row.userName === 'System Admin'
    );
  }
  isCurrentUser(row: any): boolean {
    const user = this.auth.getUserName();

    return (
      row.fullName?.includes(user) ||
      row.userName?.includes(user) ||
      row.fullName === user ||
      row.userName === user
    );
  }

  onDraftEditt(row: any) {
    this.draftEditButton.emit(row);
  }
  onDraftDelete(row: any) {
    this.draftDeleteButton.emit(row);
  }


  onToggleChange(row: any): void {
    if (this.isSystemAdmin(row) || this.isCurrentUser(row)) {
      row.isActive = !row.isActive;
      return;
    }

    this.currentToggleRow = row;
    this.previousToggleState = !row.isActive;
    this.showStatusChangeDialog = true;
    this.cdr.markForCheck();
  }

  onStatusConfirm(data: { comment: string }): void {
    if (!this.currentToggleRow) return;

    const statusAction = this.currentToggleRow.isActive ? 'Activated' : 'Deactivated';
    const userName = this.currentToggleRow.fullName || this.currentToggleRow.userName || 'User';

    this.api.changeUserStatus(this.currentToggleRow.id, this.currentToggleRow.isActive);

    this.notification.success(
      `${userName} has been ${statusAction} successfully!`
    );

    this.showStatusChangeDialog = false;
    this.currentToggleRow = null;
    this.cdr.markForCheck();
  }

  onStatusCancel(): void {
    if (!this.currentToggleRow) return;

    this.currentToggleRow.isActive = this.previousToggleState;
    this.showStatusChangeDialog = false;
    this.currentToggleRow = null;
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

  getRiskRatingStyle(riskRating: number,riskType:string): string {
    if(riskType=="Quality"){
      //  console.log(this.paginatedData)
    if (riskRating <= 4) {
      return 'green-risk';
    } else if (riskRating  >= 6 && riskRating <= 16) {
      return 'yellow-risk';
    } else {
      return 'red-risk';
    }

    }
    else if (riskType =="Security") {
      if (riskRating <= 45) {
      return 'green-risk';
    } else if (riskRating  >= 46 && riskRating <= 69) {
      return 'yellow-risk';
    } else {
      return 'red-risk';
    }

  }
  else{
    if (riskRating <= 45) {
      return 'green-risk';
    } else if (riskRating  >= 46 && riskRating <= 69) {
      return 'yellow-risk';
    } else {
      return 'red-risk';
    }
  }

}

  onclickrow = output();
  rowClick(row: any) {
    this.onclickrow.emit(row);
  }

   hasValidData(): boolean {
    return (
      this.filteredData &&
      Array.isArray(this.filteredData) &&
      this.filteredData.length > 0 &&
      this.filteredData.some((row) => row.riskName || row.riskId || row.fullName)
    );
  }


  itemsPerPage = 10;
  currentPage = 1;
  totalItems: number = 0;
  shouldDisplayPagination(): boolean {
    return this.filteredData.length > this.itemsPerPage;
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedItems();
  }

  updatePaginatedItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedData = this.filteredData.slice(startIndex, endIndex);

    if (this.paginatedData.length > 0 && (!this.rowKeys || this.rowKeys.length === 0)) {
      this.rowKeys = Object.keys(this.paginatedData[0]);
    }

    this.cdr.markForCheck();
  }


  onSearch(searchText: string): void {
    const lowercasedSearchText = searchText.toLowerCase();
    let searchFiltered = this.originalTableData.filter((item: any) =>
      Object.values(item).some(
        (value: any) =>
          value != null &&
          value.toString().toLowerCase().includes(lowercasedSearchText)
      )
    );

      this.filteredData = this.applyColumnFilters(searchFiltered);


    this.currentPage = 1;
    this.totalItems = this.filteredData.length;
    this.updatePaginatedItems();
  }

  showFilterDropdown = false;
  currentFilterColumn: string | null = null;
  filterSearchText = '';
  activeFilters: { [key: string]: string } = {};

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

  getColumnValues(column: string): string[] {
    const uniqueValues = [
      ...new Set(this.originalTableData.map((row) => row[column])),
    ];
    return ['Select All', ...uniqueValues].filter(Boolean);
  }

  getFilteredOptions(): string[] {
    if (!this.currentFilterColumn) return [];

    const options = this.getColumnValues(this.currentFilterColumn);
    if (!this.filterSearchText) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(this.filterSearchText.toLowerCase())
    );
  }

  searchFilterOptions() { }

  applyFilter(column: string, value: string) {
    if (value === 'Select All') {
      delete this.activeFilters[column];
    } else {
      this.activeFilters[column] = value;
    }
    this.filterData();
    this.showFilterDropdown = false;
    this.currentFilterColumn = null;
  }

  clearFilter(column: string) {
    delete this.activeFilters[column];
    this.filterData();
  }

   private applyColumnFilters(data: any[]): any[] {
    if (Object.keys(this.activeFilters).length === 0) {
      return data;
    }

    return data.filter(row => {
      return Object.entries(this.activeFilters).every(([column, value]) => {
        return row[column] === value;
      });
    });
  }

   private filterData() {
    let filteredData = [...this.originalTableData];

    filteredData = this.applyColumnFilters(filteredData);

    this.filteredData = filteredData;

    this.currentPage = 1;
    this.totalItems = this.filteredData.length;
    this.updatePaginatedItems();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;

    if (
      this.showFilterDropdown &&
      !targetElement.closest('.filter-dropdown') &&
      !targetElement.closest('.filter-icon')
    ) {
      this.showFilterDropdown = false;
      this.currentFilterColumn = null;
    }
  }
  editUser(event: Event, row: any) {
    event.stopPropagation();
    this.editUserClicked.emit(row);
    this.cdr.markForCheck();
  }



  getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'open': return '#EF4444';            // Vibrant Red (Critical/High priority)
    case 'closed': return '#10B981';          // Vibrant Green (Resolved/Complete)
    case 'deferred': return '#F97316';        // Vibrant Orange (Postponed)
    case 'undertreatment': return '#3B82F6';  // Vibrant Blue (In progress)
    case 'accepted': return '#A855F7';        // Vibrant Purple (Acknowledged)
    case 'monitoring': return '#FBBF24';      // Vibrant Gold (Watch/Review)
    default: return '#9CA3AF';                // Neutral Gray (Unknown/Neutral)
  }
}
}
