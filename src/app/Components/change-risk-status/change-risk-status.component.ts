import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormDropdownComponent } from '../form-dropdown/form-dropdown.component';
import { FormDateFieldComponent } from '../form-date-field/form-date-field.component';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormTextAreaComponent } from '../form-text-area/form-text-area.component';
import { FormLoaderComponent } from '../form-loader/form-loader.component';
import { FormSuccessfullComponent } from '../form-successfull/form-successfull.component';

@Component({
  selector: 'app-change-risk-status',
  standalone: true,
  imports: [
    FormDropdownComponent,
    FormDateFieldComponent,
    StyleButtonComponent,
    FormTextAreaComponent,
    ReactiveFormsModule,
    FormLoaderComponent,
    FormSuccessfullComponent,
  ],
  templateUrl: './change-risk-status.component.html',
  styleUrl: './change-risk-status.component.scss',
})
export class ChangeRiskStatusComponent {
  @Input() RiskStatuses: Array<{
    id: number;
    name: string;
  }> = [];

  @Output() submitForm = new EventEmitter<any>();
  @Output() closeRiskStatusModal = new EventEmitter<void>();
  @Output() sendToReview = new EventEmitter<any>();

  updateForm = new FormGroup({
    closeDate: new FormControl(''),
    remarks: new FormControl(''),
  });
  isLoading = false; // Initially false
  isValid: boolean = false;

  showCloseDate: boolean = false;

  riskStatusValue: number = 0;
  openDropdownId: string | undefined = undefined;

  onDropdownRiskStatus(event: any): void {
    const selectedFactorId = Number(event);
    // // console.log(selectedFactorId);
    // this.riskStatusId = selectedFactorId;
    // console.log('Selected risk staggggggggtus:', this.riskStatusId);

    const selectedFactor = this.RiskStatuses.find(
      (factor) => Number(factor.id) === selectedFactorId
    );
    if (selectedFactor) {
      this.riskStatusValue = selectedFactor.id;
      console.log('Selected risk status:', this.riskStatusValue);
    } else {
      console.log('Selected factor not found.');
    }
    if (this.riskStatusValue == 2) {
      this.showCloseDate = true;
    } else {
      this.showCloseDate = false;
    }
  }

  handleDropdownOpen(dropdownId: string | undefined): void {
    this.openDropdownId = dropdownId;
  }

  close() {
    this.closeRiskStatusModal.emit();
  }

  closepopupIsValidCheck() {
    this.isValid = false;
  }

  sendToReviewInitiator() {
    this.isLoading = true;
    const formValue = this.updateForm.value;
    if (
      (this.showCloseDate == false && this.riskStatusValue == 2) ||
      Number(this.riskStatusValue) <= 0
    ) {
      console.log('Invalid numeric fields: Values must be greater than 0.');
      this.isValid = true;
      this.isLoading = false;
      return;
    }

    const payload = {
      closedDate: formValue.closeDate
        ? `${formValue.closeDate}T00:00:00.000Z`
        : null,
      riskStatus: Number(this.riskStatusValue),
      remarks: formValue.remarks || '',
    };
    this.sendToReview.emit({ payload });
    this.isLoading = false;
    this.close();
  }

  onSubmit() {
    this.isLoading = true;
    const formValue = this.updateForm.value;
    if (
      (this.showCloseDate == false && this.riskStatusValue == 2) ||
      Number(this.riskStatusValue) <= 0
    ) {
      console.log('Invalid numeric fields: Values must be greater than 0.');
      this.isValid = true;
      this.isLoading = false;
      return;
    }


    const payload = {
      closedDate: formValue.closeDate
        ? `${formValue.closeDate}T00:00:00.000Z`
        : null,
      riskStatus: Number(this.riskStatusValue),
      remarks: formValue.remarks || '',
    };
    this.submitForm.emit({ payload });
    this.isLoading = false;
    this.close();
  }
}
