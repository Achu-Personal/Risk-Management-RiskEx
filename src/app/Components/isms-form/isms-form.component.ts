import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from "../../UI/button/button.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";

@Component({
  selector: 'app-isms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonComponent, DropdownComponent],
  templateUrl: './isms-form.component.html',
  styleUrl: './isms-form.component.scss'
})
export class ISMSFormComponent {
  descriptionText: string = '';
  ismsForm=new FormGroup({


  })
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to match content
  }
}
