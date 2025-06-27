import { Component, forwardRef, OnInit, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { department } from '../../Interfaces/deparments.interface';
import { ApiService } from '../../Services/api.service';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

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
  filteredDepartments: department[] = [];
  selectedDepartment: string = '';
  searchText: string = '';
  disabled = false;
  dropdownOpen = false;
  private subscription: Subscription = new Subscription();

  @Output() departmentSelected = new EventEmitter<department>();

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

    this.subscription.add(
      this.api.departmentUpdate$.subscribe(() => {
        this.loadDepartments();
      })
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadDepartments() {
    this.api.getDepartment().subscribe({
      next: (response) => {
        this.departments = response.sort((a, b) =>
          a.departmentName.localeCompare(b.departmentName)
        );
        this.filteredDepartments = [...this.departments];
      },
      error: (error) => {
        console.error('Failed to fetch departments', error);
        this.departments = [];
        this.filteredDepartments = [];
      }
    });
  }

  filterDepartments(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchText = searchValue;
    this.filteredDepartments = this.departments.filter(dept =>
      dept.departmentName.toLowerCase().includes(searchValue)
    );
  }

  selectDepartment(dept: department) {
    if (!this.disabled) {
      this.selectedDepartment = dept.departmentName;
      this.onChange(this.selectedDepartment);
      this.onTouched();
      this.dropdownOpen = false;

      this.departmentSelected.emit(dept);
    }
  }
  toggleDropdown() {
    if (!this.disabled) {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  // @ViewChild('dropdownInput') dropdownInput!: ElementRef;

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
