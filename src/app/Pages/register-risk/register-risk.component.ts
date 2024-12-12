import { Component } from '@angular/core';
import { SidebarComponent } from "../../Components/sidebar/sidebar.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QMSFormComponent } from "../../Components/qms-form/qms-form.component";
import { ISMSFormComponent } from "../../Components/isms-form/isms-form.component";

@Component({
  selector: 'app-register-risk',
  standalone: true,
  imports: [ DropdownComponent, CommonModule, FormsModule, QMSFormComponent, ISMSFormComponent],
  templateUrl: './register-risk.component.html',
  styleUrl: './register-risk.component.scss'
})
export class RegisterRiskComponent {
// selectedOption:string=''
//  data:any

//   constructor(public api:ApiService){}
//   ngOnInit(){
//     this.api.getRiskType().subscribe((res:any)=>{
//       this.data=res
//       console.log(this.data);

//     })





  // }

  // onDropdownChange(value: string): void {
  //   this.selectedOption = value;
  //   console.log('Selected Option:', value); // For debugging
  // }

 isSelectQuality:boolean=false
 isSelectSecurity:boolean=false
 isSelectPrivacy:boolean=false

  dropdownData = [
    {"type":"Quality","value":"quality"},
    {"type":"Security","value":"security"},
    {"type":"Privacy","value":"privacy"}];


  selectedOptionFromChild: string = '';

  setQuality(){
    this.selectedOptionFromChild='quality'
    this.isSelectQuality=true;
    this.isSelectPrivacy=false
    this.isSelectSecurity=false

  }
  setSecurity(){
     this.selectedOptionFromChild='security'
     this.isSelectQuality=false;
     this.isSelectPrivacy=false
     this.isSelectSecurity=true

  }
  setPrivacy(){
    this.selectedOptionFromChild='privacy'
    this.isSelectQuality=false
    this.isSelectPrivacy=true
    this.isSelectSecurity=false

 }

  onOptionSelected(value: string) {
    this.selectedOptionFromChild = value;
    console.log('Parent received selected value:', this.selectedOptionFromChild);
  }
}
