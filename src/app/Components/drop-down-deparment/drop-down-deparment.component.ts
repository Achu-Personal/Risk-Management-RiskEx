import { Component, forwardRef, OnInit, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { department } from '../../Interfaces/deparments.interface';
import { ApiService } from '../../Services/api.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-drop-down-deparment',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './drop-down-deparment.component.html',
  styleUrl: './drop-down-deparment.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropDownDeparmentComponent),
      multi: true
    }
  ]
})
export class DropDownDeparmentComponent implements OnInit, ControlValueAccessor {
  departments: department[] = [];
  selectedDepartment: string = '';
  disabled = false;
  dropdownOpen = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private api: ApiService,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.api.getDepartment().subscribe({
      next: (response) => {
        this.departments = response;
        console.log('Departments fetched successfully:', this.departments);
      },
      error: (error) => {
        console.error('Failed to fetch departments', error);
        this.departments = [];
      }
    });
  }

  selectDepartment(departmentName: string) {
    if (!this.disabled) {
      this.selectedDepartment = departmentName;
      this.onChange(this.selectedDepartment);
      this.onTouched();
      this.dropdownOpen = false;
    }
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  writeValue(value: string): void {
    this.selectedDepartment = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  trackByFn(index: number, item: department): number {
    return item.id;
  }
}
