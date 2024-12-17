import { Component, output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../../UI/searchbar/searchbar.component';
import { PaginationComponent } from '../../UI/pagination/pagination.component';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [SearchbarComponent, FormsModule, PaginationComponent,CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  constructor( public api: ApiService,private route:ActivatedRoute){}

   onclickrow = output()
    rowClick(row:any) {

      this.onclickrow.emit(row);
      }

  items:any=[];
  isActive = true;
  isDisabled = false;
  open = true;
  closed = false;
  isButtonVisible = false;
  checkPageForButtonVisibility(): void {
    const currentRoute = this.route.snapshot.url.join('/'); // Get current route path
    console.log(currentRoute);

    if (currentRoute === 'history') {
      this.isButtonVisible = false; // Hide button on page1
    } else if (currentRoute === 'home') {
      this.isButtonVisible = true; // Show button on page2
    }
  }
  filteredItems = [...this.items];
  paginatedItems:any=[];
  isDropdownOpen: boolean = false;
  itemsPerPage = 10;
  currentPage = 1;
  totalItems: number = 0;

  // Filter dropdown values
  selectedRiskId = '';
  selectedRiskName = '';
  selectedDepartment = '';

  // uniqueRiskIds: string[] = [];
  // uniqueRiskNames: string[] = [];
  uniqueDepartments: any[] = [];


  // ngOnInit(): void {
  //   // this.uniqueRiskIds = [...new Set(this.items.map(item => item.riskId))];
  //   // this.uniqueRiskNames = [...new Set(this.items.map(item => item.riskName))];
  //   this.uniqueDepartments = [...new Set(this.items.map(item => item.department))];
  // }

  filterTable(): void {

    this.filteredItems = this.items.filter((item:any) => {
      return (
        // (this.selectedRiskId ? item.riskId === this.selectedRiskId : true) &&
        // (this.selectedRiskName ? item.riskName === this.selectedRiskName : true) &&
        (this.selectedDepartment ? item.department === this.selectedDepartment : true)
      );
    });

  this.currentPage = 1;
  this.totalItems = this.filteredItems.length;
  this.updatePaginatedItems();
  }



  onSearch(searchText: string): void {
    const lowercasedSearchText = searchText.toLowerCase();
    this.filteredItems = this.items.filter((item: any) =>
      Object.values(item).some((value: any) =>
        value.toString().toLowerCase().includes(lowercasedSearchText)
      )
    );

    this.currentPage = 1;
    this.totalItems = this.filteredItems.length;
    this.updatePaginatedItems();
  }

  shouldDisplayPagination(): boolean {
    return this.filteredItems.length > this.itemsPerPage;
  }


  ngOnInit(): void {

    this.api.gettabledata().subscribe((res: any) => {
      this.items = res;
      this.filteredItems = [...this.items];
      this.updateUniqueDepartments();
      this.totalItems = this.filteredItems.length;
      this.updatePaginatedItems();
    });
    this.route.url.subscribe(() => {
      this.checkPageForButtonVisibility();
    });
  }

  updateUniqueDepartments(): void {
    this.uniqueDepartments = [...new Set(this.items.map((item: any) => item.department))];
  }

  updatePaginatedItems(): void {
    const startIndex = (this.currentPage -1 ) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.filteredItems.slice(startIndex, endIndex);
    // this.totalItems = this.filteredItems.length;
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
    this.isDropdownOpen = false;
    this.filterTable();
  }

}
