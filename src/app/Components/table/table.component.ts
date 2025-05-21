import { Component, HostListener, Input, Output, output, SimpleChanges, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../../UI/searchbar/searchbar.component';
import { PaginationComponent } from '../../UI/pagination/pagination.component';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth/auth.service';
import { ResidualRiskStatusStylePipe } from "../../Pipes/residual-risk-status-style.pipe";

@Component({
  selector: 'app-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SearchbarComponent, FormsModule, PaginationComponent, CommonModule, ResidualRiskStatusStylePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  constructor( public api: ApiService,private route:ActivatedRoute,private router: Router,private cdr: ChangeDetectorRef,public auth: AuthService){}
  items:any=[];
  isActive = true;
  isDisabled = false;
  open = true;
  closed = false;
  isButtonVisible = false;
  @Input() isLoading: boolean = false;
  @Input() paginated:any=[];
  @Input() reset:boolean=false;
  filteredItems = [...this.items];
  isDepartmentDropdownOpen: boolean = false;
  isTypeDropdownOpen: boolean = false;
  isStatusDropdownOpen:boolean =false;
  isReviewStatusDropdownOpen:boolean =false;
  isResidualRiskDropdownOpen:boolean =false;
  isData:boolean = false;
  itemsPerPage = 10;
  currentPage = 1;
  totalItems: number = 0;

  // Filter dropdown values
  selectedRiskId = '';
  selectedRiskType = '';
  selectedDepartment = '';
  selectedStatus = '';
  selectedReviewStatus = '';
  selectedResidual ='';
  uniqueRiskTypes: any[] = [];
  uniqueDepartments: any[] = [];
  uniqueStatus: any[] = [];
  uniqueReviewStatus: any[] = [];
  uniqueResidual:any[]=[];

  @Output() filteredData = new EventEmitter<any[]>();
  filterTimeout: ReturnType<typeof setTimeout> | null = null;
  reviewStatusMap: Record<string, string> = {
    ReviewPending: "Review Pending",
    ReviewCompleted:"Review Completed",
    ApprovalPending:"Approval Pending",
    ApprovalCompleted:"Approval Completed",
    Rejected:"Rejected"
  };

  getReviewStatus(status: string): string {
    switch (status) {
      case 'Review Pending': return 'ReviewPending';
      case 'Review Completed': return 'ReviewCompleted';
      case 'Approval Pending': return 'ApprovalPending';
      case 'Approval Completed': return 'ApprovalCompleted';
      case 'Rejected': return 'Rejected';
      default: return 'Unknown Status';
    }
  }

  onclickrow = output()
    rowClick(row:any) {
      this.onclickrow.emit(row);
}

  filterTable(): void {
    const reviewStatus = this.getReviewStatus(this.selectedReviewStatus);
    if (this.filterTimeout) clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
    this.filteredItems = this.items.filter((item:any) => {
      let matchesDateRange = true;
      if (this.filteredDateRange) {
        const { startDate, endDate } = this.filteredDateRange;
        if (startDate && endDate) {
          const itemDate = new Date(item.plannedActionDate);
          const start = new Date(startDate);
          const end = new Date(endDate);
          matchesDateRange = itemDate >= start && itemDate <= end ;
        }
      }
      return (
        matchesDateRange &&
        (this.selectedRiskType ? item.riskType === this.selectedRiskType : true) &&
        (this.selectedStatus ? item.riskStatus === this.selectedStatus : true) &&
        (this.selectedResidual ? item.residualRisk === this.selectedResidual : true) &&
        (this.selectedReviewStatus ? item.riskAssessments[0].reviewStatus === reviewStatus : true) &&
        (this.selectedDepartment ? item.departmentName === this.selectedDepartment : true)
      );
    });
  this.currentPage = 1;
  this.totalItems = this.filteredItems.length;
  this.updatePaginatedItems();
  }, 500);
  }

  onSearch(searchText: string): void {
    const lowercasedSearchText = searchText.toLowerCase();
    this.filteredItems = this.items.filter((item: any) =>
      Object.values(item).some((value: any) =>
        value != null && value.toString().toLowerCase().includes(lowercasedSearchText)
      )
    );
    this.currentPage = 1;
    this.totalItems = this.filteredItems.length;
    this.updatePaginatedItems();
  }
  ngOnInit(): void {
    const currentRoute = this.route.snapshot.url.join('/');
    if (currentRoute === 'history') {
      this.isButtonVisible = true;
    } else if (currentRoute === 'home') {
      this.isButtonVisible = false;
    }
  }
  isDepartmentUser:boolean=false;
  private initializeItems(): void {
    setTimeout(()=>{
      const role = this.auth.getUserRole();
      this.isDepartmentUser = role === 'DepartmentUser';
      this.items = [...this.paginated];
      this.hasValidData();
      this.filteredItems = [...this.items];
      this.updateUniqueDepartments();
      this.updateUniqueTypes();
      this.updateUniqueReviewStatus();
      this.updateUniqueStatus();
      this.updateResidualRiskStatus();
      this.totalItems = this.filteredItems.length;
      this.updatePaginatedItems();

      console.log("table items",this.items)
    },800)

  }
  @Input() noDataMessage:string='No risks'
  hasValidData(): boolean {
    return this.paginated && this.paginated.length >0;
  }

  updateUniqueDepartments(): void {

    this.uniqueDepartments = [...new Set(this.items.map((item: any) => item.departmentName))];
  }

  updateUniqueTypes(): void {

    this.uniqueRiskTypes= [...new Set(this.items.map((item: any) => item.riskType))];

  }
  updateUniqueStatus(): void {

    this.uniqueStatus = [...new Set(this.items.map((item: any) => item.riskStatus))];

  }
  updateUniqueReviewStatus(): void {

    this.uniqueReviewStatus = [...new Set(this.items.map((item: any) => this.reviewStatusMap[item.riskAssessments[0].reviewStatus]))];

  }
  updateResidualRiskStatus(): void {

    this.uniqueResidual = [...new Set(this.items.map((item: any) => item.residualRisk))];

  }

  updatePaginatedItems(): void {
    if(this.filteredItems){
      this.isData =true;
    }
    const startIndex = (this.currentPage -1 ) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginated = this.filteredItems.slice(startIndex, endIndex);
    this.totalItems = this.filteredItems.length;
    this.cdr.markForCheck();
    this.filteredData.emit(this.filteredItems);
  }

  onItemsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    this.currentpage();
    this.updatePaginatedItems();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedItems();
  }

  toggleDepartmentDropdown(): void {
    this.isDepartmentDropdownOpen = !this.isDepartmentDropdownOpen;
    this.isTypeDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isReviewStatusDropdownOpen = false;
    this.isResidualRiskDropdownOpen = false;
  }

  toggleTypeDropdown(): void {
    this.isTypeDropdownOpen = !this.isTypeDropdownOpen;
    this.isDepartmentDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isReviewStatusDropdownOpen = false;
    this.isResidualRiskDropdownOpen = false;
  }
  toggleStatusDropdown(): void {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
    this.isDepartmentDropdownOpen = false;
    this.isTypeDropdownOpen = false;
    this.isReviewStatusDropdownOpen = false;
    this.isResidualRiskDropdownOpen = false;
  }
  toggleReviewStatusDropdown(): void {
    this.isReviewStatusDropdownOpen = !this.isReviewStatusDropdownOpen;
    this.isDepartmentDropdownOpen = false;
    this.isTypeDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isResidualRiskDropdownOpen = false;
  }
  toggleResidualDropdown(): void {
    this.isResidualRiskDropdownOpen = !this.isResidualRiskDropdownOpen;
    this.isDepartmentDropdownOpen = false;
    this.isTypeDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isReviewStatusDropdownOpen = false;
  }

  onDepartmentSelect(department: string): void {
    this.selectedDepartment = department;
    this.isDepartmentDropdownOpen = false;
    this.filterTable();
  }
  onTypeSelect(type: string): void {
    this.selectedRiskType = type;
    this.isTypeDropdownOpen = false;
    this.filterTable();
  }
  onStatusSelect(status: string): void {
    this.selectedStatus = status;
    this.isStatusDropdownOpen = false;
    this.filterTable();
  }
  onReviewStatusSelect(status: string): void {
    this.selectedReviewStatus = status;
    this.isReviewStatusDropdownOpen = false;
    this.filterTable();
  }
  onResidualSelect(status: string): void {
    this.selectedResidual = status;
    this.isResidualRiskDropdownOpen = false;
    this.filterTable();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isDepartmentDropdownOpen = false;
      this.isTypeDropdownOpen = false;
      this.isStatusDropdownOpen = false;
      this.isReviewStatusDropdownOpen = false;
    }
  }

  resetFilters(): void {
    this.selectedRiskId = '';
    this.selectedRiskType = '';
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.selectedReviewStatus = '';
    this.selectedResidual = '';
    this.filteredDateRange = null;
    this.filteredItems = [...this.items];
    this.currentPage = 1;
    this.totalItems = this.filteredItems.length;
    this.updatePaginatedItems();
  }

  //datepicker
  @Input() filteredDateRange: { startDate: string; endDate: string } | null = null;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['paginated'] ) {
      this.filteredItems = [...this.items];
      this.totalItems = this.filteredItems.length;
      this.initializeItems();
    }

    if (changes['filteredDateRange'] && this.filteredDateRange) {

      this.filterTable();
    }
    if(changes['itemsPerPage']){
      this.currentpage();
    }
    if(changes['reset']){
      // console.log("clicked")
      this.resetFilters();
    }
  }
  currentpage(){
    this.currentPage = 1;
  }

  shouldDisplayPagination(): boolean {
    return this.filteredItems.length > this.itemsPerPage;

  }

  //sorting
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn: string = '';
  sortTable(column: string) {
    this.sortDirection = this.sortColumn === column
      ? (this.sortDirection === 'asc' ? 'desc' : 'asc')
      : 'asc';
    this.sortColumn = column;
  this.filteredItems = [...this.filteredItems].sort((a, b) => {
    if (column === 'crr') {
      const valueA = this.getCRRValue(a);
      const valueB = this.getCRRValue(b);
      return (valueA - valueB) * (this.sortDirection === 'asc' ? 1 : -1);
    }
    if (column === 'plannedActionDate') {
      const valueA = new Date(a.plannedActionDate).getTime();
      const valueB = new Date(b.plannedActionDate).getTime();
      return (valueA - valueB) * (this.sortDirection === 'asc' ? 1 : -1);
    }
    return 0;
  });
    this.currentPage = 1;
    this.updatePaginatedItems();
    this.cdr.markForCheck();
  }
  private getCRRValue(item: any): number {
    return item.overallRiskRatingAfter !== null
      ? item.overallRiskRatingAfter
      : item.overallRiskRatingBefore;
  }
}
