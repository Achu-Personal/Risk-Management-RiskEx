import {ChangeDetectionStrategy, model} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StyleButtonComponent } from "../style-button/style-button.component";


@Component({
  selector: 'app-datepicker',
  standalone: true,
  providers: [provideNativeDateAdapter(),],
  imports: [MatCardModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, StyleButtonComponent],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss'
})
export class DatepickerComponent {

  showDropdown = false;
  startDate: string | null = null;
  endDate: string | null = null;
  dateRange: string = '';

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  updateDateRange() {
    if (this.startDate && this.endDate) {
      this.dateRange = `${this.startDate} to ${this.endDate}`;
    }
  }

  parseDateRange() {
    const range = this.dateRange.split(' to ');
    if (range.length === 2) {
      this.startDate = range[0];
      this.endDate = range[1];
    }
  }

}
