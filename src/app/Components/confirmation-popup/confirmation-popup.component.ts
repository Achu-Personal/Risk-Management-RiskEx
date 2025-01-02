import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, CommonModule, StyleButtonComponent],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss'
})
export class ConfirmationPopupComponent {
  // @Input() isOpen = false;
  // @Input() title = '';
  // @Input() confirmText = 'Confirm';
  // @Input() showComment = true;
  // @Input() isReject = false;
  // @Output() confirm = new EventEmitter<{comment: string}>();
  // @Output() cancel = new EventEmitter<void>();

  // form: FormGroup;

  // constructor(private fb: FormBuilder) {
  //   this.form = this.fb.group({
  //     comment: ['', []]
  //   });
  // }

  // ngOnInit() {
  //   if (this.isReject) {
  //     this.form.get('comment')?.setValidators(Validators.required);
  //   }
  // }

  // onConfirm() {
  //   if (this.form.valid) {
  //     this.confirm.emit({
  //       comment: this.form.get('comment')?.value || ''
  //     });
  //   }
  // }

  // onCancel() {
  //   this.cancel.emit();
  // }


  @Input() isOpen = false;
  @Input() title = '';
  @Input() confirmText = 'Confirm';
  @Input() showComment = true;
  @Input() isReject = false;
  @Output() confirm = new EventEmitter<{comment: string}>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      comment: ['', []]
    });
  }

  ngOnChanges() {
    if (this.isReject) {
      this.form.get('comment')?.setValidators(Validators.required);
    } else {
      this.form.get('comment')?.clearValidators();
    }
    this.form.get('comment')?.updateValueAndValidity();
  }

  onConfirm() {
    if (this.form.valid) {
      this.confirm.emit({
        comment: this.form.get('comment')?.value || ''
      });
      this.form.reset();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.form.reset();
  }

}
