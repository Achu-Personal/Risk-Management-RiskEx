import { Component } from '@angular/core';
import { SidebarComponent } from "../../Components/sidebar/sidebar.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QMSFormComponent } from "../../Components/qms-form/qms-form.component";
import { ISMSFormComponent } from "../../Components/isms-form/isms-form.component";
import { ButtonComponent } from "../../UI/button/button.component";

@Component({
  selector: 'app-register-risk',
  standalone: true,
  imports: [DropdownComponent, CommonModule, FormsModule, QMSFormComponent, ISMSFormComponent, ButtonComponent],
  templateUrl: './register-risk.component.html',
  styleUrl: './register-risk.component.scss'
})
export class RegisterRiskComponent {

 isSelectQuality:boolean=false
 isSelectSecurity:boolean=false
 isSelectPrivacy:boolean=false
 isSelectNothing:boolean=true
 isSelect:boolean=false
 selectedOptionFromChild: string = '';


  dropdownData = [
    {"type":"Quality","value":"quality"},
    {"type":"Security","value":"security"},
    {"type":"Privacy","value":"privacy"}];




  setQuality(){
    this.selectedOptionFromChild='quality'
    this.isSelectQuality=true;
    this.isSelectPrivacy=false
    this.isSelectSecurity=false
    this.isSelectNothing=false
    this.isSelect=true

  }
  setSecurity(){
     this.selectedOptionFromChild='security'
     this.isSelectQuality=false;
     this.isSelectPrivacy=false
     this.isSelectSecurity=true
     this.isSelectNothing=false
     this.isSelect=true

  }
  setPrivacy(){
    this.selectedOptionFromChild='privacy'
    this.isSelectQuality=false
    this.isSelectPrivacy=true
    this.isSelectSecurity=false
    this.isSelectNothing=false
    this.isSelect=true

 }

  onOptionSelected(value: string) {
    this.selectedOptionFromChild = value;
    console.log('Parent received selected value:', this.selectedOptionFromChild);
  }
}
