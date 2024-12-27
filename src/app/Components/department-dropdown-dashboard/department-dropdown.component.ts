import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { department } from '../../Interfaces/deparments.interface';

@Component({
  selector: 'app-department-dropdown',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './department-dropdown.component.html',
  styleUrl: './department-dropdown.component.scss',
})
export class DepartmentDropdownComponent {
  dropdownOpen = false;
  searchTerm = '';
  selectedItems: department[] = [];
  selectedDepartment: string = 'Select Department';

  constructor(public api: ApiService) { }

  dropdownOptions: department[] = [];

  ngOnInit() {
    this.api.getDepartment().subscribe(
      (response: department[]) => {
        this.dropdownOptions = response;
        console.log('Departments fetched successfully:', this.dropdownOptions);
      },
      (error) => {
        console.error('Failed to fetch departments', error);
      }
    );
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    console.log('Dropdown Open State:', this.dropdownOpen);
  }

  filterOptions() {
    const term = this.searchTerm.toLowerCase().trim();
    return this.dropdownOptions.filter((option: department) =>
      option.departmentName?.toLowerCase().includes(term)
    );
  }

  toggleSelection(item: department) {
    const index = this.selectedItems.findIndex(
      (selected) => selected.id === item.id
    );

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.updateSelectedDepartment();
  }

  isSelected(item: department) {
    return this.selectedItems.some((selected) => selected.id === item.id);
  }

  selectAll() {
    if (this.selectedItems.length === this.dropdownOptions.length) {
      this.selectedItems = [];
    } else {
      this.selectedItems = [...this.dropdownOptions];
    }
    this.updateSelectedDepartment();
  }

  isAllSelected() {
    return this.selectedItems.length === this.dropdownOptions.length;
  }

  updateSelectedDepartment() {
    if (this.selectedItems.length > 0) {
      this.selectedDepartment = this.selectedItems
        .map((dept) => dept.departmentName)
        .join(', ');
    } else {
      this.selectedDepartment = 'Select Department';
    }
    console.log(
      'Selected Departments:',
      this.selectedItems.map((d) => d.departmentName)
    );
  }

  passToOtherComponent() {
    console.log(
      'Passing selected departments to another component:',
      this.selectedItems
    );
  }
}
