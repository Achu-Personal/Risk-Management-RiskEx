import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-isms-form',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './isms-form.component.html',
  styleUrl: './isms-form.component.scss'
})
export class ISMSFormComponent {
  ismsForm=new FormGroup({


  })

}
