import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";


@Component({
  selector: 'app-qms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DropdownComponent],
  templateUrl: './qms-form.component.html',
  styleUrl: './qms-form.component.scss'
})
export class QMSFormComponent {
  qmsForm=new FormGroup({


  })
  data:any
constructor(public api:ApiService){}

  ngOninit(){
    this.api.getRiskCurrentAssessment().subscribe((res:any)=>{
      this.data=res
      console.log(this.data)
    })
  }

}
