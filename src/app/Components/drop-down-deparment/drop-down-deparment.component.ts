import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { department } from '../../Interfaces/deparments.interface';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-drop-down-deparment',
  standalone: true,
  imports: [],
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

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.api.getDepartment().subscribe(
      (response) => {
        this.departments = response;
        console.log('Departments fetched successfully:', this.departments);
      },
      (error) => {
        console.error('Failed to fetch departments', error);
        this.departments = [];
      }
    );
  }

  onSelectionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedDepartment = target.value;
    this.onChange(this.selectedDepartment);
    this.onTouched();
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.selectedDepartment = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

