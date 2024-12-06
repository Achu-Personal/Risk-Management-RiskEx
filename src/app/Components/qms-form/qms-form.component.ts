import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-qms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DropdownComponent, ButtonComponent,CommonModule],
  templateUrl: './qms-form.component.html',
  styleUrl: './qms-form.component.scss'
})
export class QMSFormComponent {
  qmsForm=new FormGroup({


  })
  data:any
  descriptionText: string = '';
constructor(public api:ApiService){}

  ngOninit(){
    this.api.getRiskCurrentAssessment().subscribe((res:any)=>{
      this.data=res
      console.log(this.data)
    })
  }



  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to match content
  }
}
