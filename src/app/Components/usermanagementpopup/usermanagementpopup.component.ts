import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-usermanagementpopup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usermanagementpopup.component.html',
  styleUrl: './usermanagementpopup.component.scss'
})
export class UsermanagementpopupComponent {
  @Input() modalId: string = 'confirmationModal';
  @Input() resultModalId: string = 'resultModal';
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() resultMessage: string = '';
  @Input() isSuccess: boolean = true;
  @Output() confirmed = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  private sourceModalId: string = '';

  onConfirm() {
    const sourceModal = document.querySelector('.modal.show:not(#' + this.modalId + ')') as HTMLElement;
    if (sourceModal) {
      this.sourceModalId = sourceModal.id;
    }

    // Close confirmation modal and emit confirmed event
    const confirmModal = document.getElementById(this.modalId);
    if (confirmModal) {
      const bsModal = new (window as any).bootstrap.Modal(confirmModal);
      bsModal.hide();
    }

    this.confirmed.emit();
  }

  showResultModal(message: string, success: boolean) {
    this.resultMessage = message;
    this.isSuccess = success;

    // Show result modal
    const resultModal = document.getElementById(this.resultModalId);
    if (resultModal) {
      const bsResultModal = new (window as any).bootstrap.Modal(resultModal);
      bsResultModal.show();
    }
  }

  onResultModalHidden() {
    // Close the source modal if it exists
    if (this.sourceModalId) {
      const sourceModal = document.getElementById(this.sourceModalId);
      if (sourceModal) {
        const bsModal = new (window as any).bootstrap.Modal(sourceModal);
        bsModal.hide();
      }
      this.sourceModalId = '';
    }

    // Clean up any remaining modals and backdrops
    document.body.classList.remove('modal-open');
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].remove();
    }

    this.completed.emit();
  }
}
