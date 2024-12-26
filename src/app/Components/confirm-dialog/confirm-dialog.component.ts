import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatDialogModule, StyleButtonComponent, FormsModule, ReactiveFormsModule,],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  
  @Input() IsCommentRequiered:boolean=false;

   isButtonClicked:boolean = false;
    commentForm = new FormGroup({
    approve: new FormControl('')});
    
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {
    
  }

  
  onConfirm(): void {
    this.dialogRef.close(true);
 

      console.log(this.commentForm.value);
    
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
  
}
