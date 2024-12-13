import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-dropdown',
  standalone: true,
  imports: [FormsModule,NgIf,NgFor],
  templateUrl: './department-dropdown.component.html',
  styleUrl: './department-dropdown.component.scss'
})
export class DepartmentDropdownComponent {
  dropdownOpen = false;
  searchTerm = '';
  selectedItems: string[] = [];
  selectedDepartment: string = 'Select Department';

  dropdownOptions = [
    'Human Resources (HR)',
    'Information Technology (IT)',
    'Finance',
    'Support',
    'Marketing',
    'Sales',
    'Operations',
    'Customer Service',
    'Product Management',
    'Quality Assurance (QA)',
    'Legal',
    'Administrative',
    'Business Development',
    'Strategy and Planning',
    'Analytics',
    'Research and Development (R&D)',
    'Purchasing',
    'Logistics',
    'Compliance',
    'Training and Development'
  ];

  // Method to toggle the dropdown open/close
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    console.log('Dropdown Open State:', this.dropdownOpen);
  }

  // Filter dropdown options based on search term
  filterOptions() {
    const term = this.searchTerm.toLowerCase();
    return this.dropdownOptions.filter(option =>
      option.toLowerCase().includes(term)
    );
  }

  // Toggle selection of a department
  toggleSelection(item: string) {
    if (this.selectedItems.includes(item)) {
      this.selectedItems = this.selectedItems.filter(i => i !== item);
    } else {
      this.selectedItems.push(item);
    }
    this.updateSelectedDepartment();
  }

  // Check if an item is already selected
  isSelected(item: string) {
    return this.selectedItems.includes(item);
  }

  // Select or deselect all departments
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

  // Update placeholder text and log selected departments to the console
  updateSelectedDepartment() {
    if (this.selectedItems.length > 0) {
      this.selectedDepartment = this.selectedItems.join(', ');
    } else {
      this.selectedDepartment = 'Select Department';
    }
    console.log('Selected Departments:', this.selectedItems);
  }

  // Method to pass selected items to other components or services
  passToOtherComponent() {
    // Here, we simulate passing selected items
    console.log('Passing selected departments to another component:', this.selectedItems);
  }
}
