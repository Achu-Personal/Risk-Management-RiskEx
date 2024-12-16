import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../../UI/searchbar/searchbar.component';
import { PaginationComponent } from '../../UI/pagination/pagination.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [SearchbarComponent, FormsModule, PaginationComponent,CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {


  items = [
    // Example data
    { slNo: 1, riskId: 'R001', riskName: 'Risk A', department: 'Finance', type: 'Type 1', endDate: '2024-12-20', currentRiskRating: 'High', assignee: 'John', reviewer: 'Jane', reviewStatus: 'Reviewed', status: 'Open' },
    { slNo: 2, riskId: 'R002', riskName: 'Risk B', department: 'HR', type: 'Type 2', endDate: '2024-12-25', currentRiskRating: 'Medium', assignee: 'Alice', reviewer: 'Bob', reviewStatus: 'Pending', status: 'Closed' },
    { slNo: 3, riskId: 'R002', riskName: 'Risk B', department: 'HR', type: 'Type 2', endDate: '2024-12-25', currentRiskRating: 'Medium', assignee: 'Alice', reviewer: 'Bob', reviewStatus: 'Pending', status: 'Closed' },
    // { slNo: 4, riskId: 'R002', riskName: 'Risk B', department: 'HR', type: 'Type 2', endDate: '2024-12-25', currentRiskRating: 'Medium', assignee: 'Alice', reviewer: 'Bob', reviewStatus: 'Pending', status: 'Closed' },
    // { slNo: 5, riskId: 'R002', riskName: 'Risk B', department: 'HR', type: 'Type 2', endDate: '2024-12-25', currentRiskRating: 'Medium', assignee: 'Alice', reviewer: 'Bob', reviewStatus: 'Pending', status: 'Closed' },
    // { slNo: 6, riskId: 'R002', riskName: 'Risk B', department: 'HR', type: 'Type 2', endDate: '2024-12-25', currentRiskRating: 'Medium', assignee: 'Alice', reviewer: 'Bob', reviewStatus: 'Pending', status: 'Closed' },
    { slNo: 7, riskId: 'R001', riskName: 'Risk A', department: 'Finance', type: 'Type 1', endDate: '2024-12-20', currentRiskRating: 'High', assignee: 'John', reviewer: 'Jane', reviewStatus: 'Reviewed', status: 'Open' },
    { slNo: 8, riskId: 'R001', riskName: 'Risk A', department: 'Finance', type: 'Type 1', endDate: '2024-12-20', currentRiskRating: 'High', assignee: 'John', reviewer: 'Jane', reviewStatus: 'Reviewed', status: 'Open' },
    { slNo: 9, riskId: 'R001', riskName: 'Risk A', department: 'Finance', type: 'Type 1', endDate: '2024-12-20', currentRiskRating: 'High', assignee: 'John', reviewer: 'Jane', reviewStatus: 'Reviewed', status: 'Open' },
    { slNo: 10, riskId: 'R001', riskName: 'Risk A', department: 'Finance', type: 'Type 1', endDate: '2024-12-20', currentRiskRating: 'High', assignee: 'John', reviewer: 'Jane', reviewStatus: 'Reviewed', status: 'Open' },
    { slNo: 11, riskId: 'R001', riskName: 'Risk A', department: 'Finance', type: 'Type 1', endDate: '2024-12-20', currentRiskRating: 'High', assignee: 'John', reviewer: 'Jane', reviewStatus: 'Reviewed', status: 'Open' },
    { slNo: 12, riskId: 'R001', riskName: 'Risk A', department: 'Finance', type: 'Type 1', endDate: '2024-12-20', currentRiskRating: 'High', assignee: 'John', reviewer: 'Jane', reviewStatus: 'Reviewed', status: 'Open' },
    { slNo: 13, riskId: 'R001', riskName: 'Risk A', department: 'Finance', type: 'Type 1', endDate: '2024-12-20', currentRiskRating: 'High', assignee: 'John', reviewer: 'Jane', reviewStatus: 'Reviewed', status: 'Open' },
    { slNo: 14, riskId: 'R002', riskName: 'Risk B', department: 'HR', type: 'Type 2', endDate: '2024-12-25', currentRiskRating: 'Medium', assignee: 'Alice', reviewer: 'Bob', reviewStatus: 'Pending', status: 'Closed' },

  ];

  isActive = true;
  isDisabled = false;
  open = true;
  closed = false;

  filteredItems = [...this.items]; // Clone of the items array
  paginatedItems:any=[];
  isDropdownOpen: boolean = false;
  itemsPerPage = 10; // Pagination setting
  currentPage = 1;
  totalItems: number = 0;

  // Filter dropdown values
  selectedRiskId = '';
  selectedRiskName = '';
  selectedDepartment = '';

  // uniqueRiskIds: string[] = [];
  // uniqueRiskNames: string[] = [];
  uniqueDepartments: string[] = ["finance","hr"];


  // ngOnInit(): void {
  //   // this.uniqueRiskIds = [...new Set(this.items.map(item => item.riskId))];
  //   // this.uniqueRiskNames = [...new Set(this.items.map(item => item.riskName))];
  //   this.uniqueDepartments = [...new Set(this.items.map(item => item.department))];
  // }

  filterTable(): void {
    this.filteredItems = this.items.filter(item => {
      return (
        // (this.selectedRiskId ? item.riskId === this.selectedRiskId : true) &&
        // (this.selectedRiskName ? item.riskName === this.selectedRiskName : true) &&
        (this.selectedDepartment ? item.department === this.selectedDepartment : true)
      );
    });
    // Reset pagination metadata
  this.currentPage = 1; // Go back to the first page after filtering
  this.updatePaginatedItems();
  }

  onSearch(searchText: string): void {
    this.paginatedItems = this.items.filter(item =>
      Object.values(item).some(value => value.toString().toLowerCase().includes(searchText.toLowerCase()))
    );
  }

  shouldDisplayPagination(): boolean {
    return this.filteredItems.length > this.itemsPerPage;
  }


  ngOnInit(): void {

    this.filteredItems = [...this.items];

    this.paginatedItems = [...this.items];
    // this.totalItems = this.items.length;
    this.uniqueDepartments = [...new Set(this.items.map(item => item.department))];
    this.totalItems = this.items.length;
    this.updatePaginatedItems();
  }



  updatePaginatedItems(): void {
    const startIndex = (this.currentPage -1 ) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.filteredItems.slice(startIndex, endIndex);
    this.totalItems = this.filteredItems.length;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedItems();
  }



  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onDepartmentSelect(department: string): void {
    this.selectedDepartment = department;
    this.isDropdownOpen = false; // Close dropdown after selection
    this.filterTable(); // Apply the filter
  }

}
