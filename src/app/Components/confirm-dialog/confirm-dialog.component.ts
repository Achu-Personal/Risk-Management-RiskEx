import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatDialogModule, StyleButtonComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  IsCommentRequiered:boolean=true;

   isButtonClicked:boolean = true;
    commentForm = new FormGroup({
    approve: new FormControl('')});
    
constructor(
  public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data:  { message: string; approvalStatus: string }
) {
 
}
ngOnInit(): void {
  // Set IsCommentRequiered to true if the approval status is 'rejected'
  if (this.data.approvalStatus === 'rejected') {
    this.IsCommentRequiered = true;
    this.commentForm.get('approve')?.setValidators([Validators.required]); // Make comment field required
  } else {
    this.IsCommentRequiered = false;
    this.commentForm.get('approve')?.clearValidators(); // Remove validation for other cases
  }

  this.commentForm.get('approve')?.updateValueAndValidity(); // Refresh validation
}
  
  // onConfirm(): void {
  //   this.dialogRef.close(true);
 

  //     console.log(this.commentForm.value);
    
  // }

  // onCancel(): void {
  //   this.dialogRef.close(false);
  // }

  onConfirm(): void {
    if (this.commentForm.valid) {
      this.dialogRef.close({ confirmed: true, comment: this.commentForm.value.approve });
      console.log(this.commentForm.value);
    } else {
      console.error('Form is invalid');
    }
  }

  onCancel(): void {
    this.dialogRef.close({ confirmed: false });
  }

}
