import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-form-category-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-category-table.component.html',
  styleUrl: './form-category-table.component.scss'
})
export class FormCategoryTableComponent {

  @Output() closeModalEvent = new EventEmitter<void>(); 

  closeModal() {
    this.closeModalEvent.emit();
  }

}
