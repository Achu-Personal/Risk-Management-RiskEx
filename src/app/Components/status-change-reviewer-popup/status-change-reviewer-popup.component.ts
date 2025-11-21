import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormDropdownComponent } from "../form-dropdown/form-dropdown.component";
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";
import { FormDataNotInListComponent } from "../form-data-not-in-list/form-data-not-in-list.component";
import { FormSuccessfullComponent } from "../form-successfull/form-successfull.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-change-reviewer-popup',
  standalone: true,
  imports: [FormDropdownComponent, StyleButtonComponent, FormDataNotInListComponent, FormSuccessfullComponent, CommonModule],
  templateUrl: './status-change-reviewer-popup.component.html',
  styleUrl: './status-change-reviewer-popup.component.scss'
})
export class StatusChangeReviewerPopupComponent {

    constructor(
      private el: ElementRef,
      private api: ApiService,
      private router: Router
    ) {}

    @Output() closeRiskStatusModal = new EventEmitter<void>();
    @Output() sendToReview = new EventEmitter<any>();

    isnewReviewernameDisplay: boolean = false;
    dropdownReviewer:any[]=[];

    internalReviewerIdFromDropdown: number = 0;
    externalReviewerIdFromDropdown: number = 0;
    isInternal: boolean = false;
    openDropdownId: string | undefined = undefined;

    reviewerNotInList: boolean = false;
    dropdownDepartment: any[] = [];
    isLoading: boolean = false;
    externalReviewerIdFromInput: number = 0;
    isSuccessReviewer: boolean = false;
    newReviewername: string = '';
    isErrorReviewer: boolean = false;

    // Add validation properties
    showReviewerError: boolean = false;
    reviewerErrorMessage: string = 'Please select a reviewer before sending for review';

    ngOnInit(){
      this.api
        .getAllReviewer()
        .pipe(
          catchError((error) => {
            console.error('Error fetching Reviewers:', error);
            return of({ reviewers: [] });
          })
        )
        .subscribe((res: any) => {
          const dropdownDataReviewer = res.reviewers.sort((a:any, b:any) => {
            const fullNameA = a.fullName ? a.fullName.toLowerCase() : '';
            const fullNameB = b.fullName ? b.fullName.toLowerCase() : '';
            return fullNameA.localeCompare(fullNameB);
          });
          console.log("the sorted is is ",dropdownDataReviewer)
          this.dropdownReviewer=dropdownDataReviewer;
        });

      this.api
        .getDepartment()
        .pipe(
          catchError((error) => {
            console.error('Error fetching Departments:', error);
            return of([]);
          })
        )
        .subscribe((res: any) => {
          this.dropdownDepartment = res;
        });
    }

    onDropdownChangeReviewer(selectedReviewer: any) {
      const selectedreviewer = selectedReviewer;

      // Clear error when user selects a reviewer
      this.showReviewerError = false;

      const selectedFactor = this.dropdownReviewer.find(
        (factor) => factor.fullName === selectedreviewer
      );

      if (selectedFactor) {
        if (selectedFactor.type === 'Internal') {
          this.isInternal = true;
          this.internalReviewerIdFromDropdown = selectedFactor.id;
        } else if (selectedFactor.type === 'External') {
          this.isInternal = false;
          this.externalReviewerIdFromDropdown = selectedFactor.id;
        }
      } else {
        console.error('No matching reviewer found for the selected ID.');
      }
    }

    handleDropdownOpen(dropdownId: string | undefined): void {
      this.openDropdownId = dropdownId;
    }

    isReviewerNotInList() {
      this.reviewerNotInList = !this.reviewerNotInList;
    }

    close() {
      this.closeRiskStatusModal.emit();
    }

    receiveCancel(value: any) {
      if (value == false) {
        this.isReviewerNotInList();
      }
    }

    saveReviewer(value: any) {
      this.isLoading = true;

      const payload = {
        email: value.email,
        fullName: value.fullName,
        departmentId: value.departmentId,
      };

      this.api.addExternalReviewer(payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;

          if (res) {
            this.externalReviewerIdFromInput = res.reviewerId;
            this.isSuccessReviewer = true;
            this.newReviewername = payload.fullName;
            this.isnewReviewernameDisplay = true;
            // Clear error since reviewer is now added
            this.showReviewerError = false;
          } else {
            console.error(
              'External Reviewer ID is not available in the response:',
              res
            );
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error occurred while fetching Reviewer ID:', err);
          this.isErrorReviewer = true;
        },
      });
    }

    closeReviewer() {
      this.isSuccessReviewer = false;
      this.isErrorReviewer = false;
    }

    sendToReviewInitiator(){
      // Validate reviewer selection
      const hasReviewerFromDropdown = this.internalReviewerIdFromDropdown !== 0 || this.externalReviewerIdFromDropdown !== 0;
      const hasReviewerFromInput = this.externalReviewerIdFromInput !== 0;

      if (!hasReviewerFromDropdown && !hasReviewerFromInput) {
        this.showReviewerError = true;
        return; // Stop execution if no reviewer is selected
      }

      this.showReviewerError = false;

      const payload = {
        isInternal: this.isInternal,
        reviewerId: this.isInternal ? this.internalReviewerIdFromDropdown : this.externalReviewerIdFromDropdown,
        ExternalReviewerFromInput: this.externalReviewerIdFromInput
      }

      this.sendToReview.emit({ payload });
      this.close();
    }
}
