import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormDropdownComponent } from "../form-dropdown/form-dropdown.component";
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";
import { FormDataNotInListComponent } from "../form-data-not-in-list/form-data-not-in-list.component";
import { FormSuccessfullComponent } from "../form-successfull/form-successfull.component";

@Component({
  selector: 'app-status-change-reviewer-popup',
  standalone: true,
  imports: [FormDropdownComponent, StyleButtonComponent, FormDataNotInListComponent, FormSuccessfullComponent],
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
     isLoading: boolean = false; // Initially false
      externalReviewerIdFromInput: number = 0;
       isSuccessReviewer: boolean = false;
         newReviewername: string = '';
           isErrorReviewer: boolean = false;


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
          // console.log("regeregeregeregereg",res.reviewers)
          const dropdownDataReviewer = res.reviewers.sort((a:any, b:any) => {
            const fullNameA = a.fullName ? a.fullName.toLowerCase() : ''; // Ensure case-insensitive comparison
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
    // console.log('selected factor id is ', selectedreviewer);

    const selectedFactor = this.dropdownReviewer.find(
      (factor) => factor.fullName === selectedreviewer
    );
    // console.log('selected factor is ', selectedFactor);
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
    this.isLoading = true; // Show loader when function starts

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
        } else {
          console.error(
            'External Reviewer ID is not available in the response:',
            res
          );
        }
      },
      error: (err) => {
        this.isLoading = false; // Hide loader on error
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
      const payload={
        isInternal: this.isInternal,
        reviewerId: this.isInternal ? this.internalReviewerIdFromDropdown:this.externalReviewerIdFromDropdown ,
        ExternalReviewerFromInput: this.externalReviewerIdFromInput
      }
      this.sendToReview.emit({ payload });
      this.close();

  }




}
