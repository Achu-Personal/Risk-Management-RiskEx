
import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';

import { CapitalizeFirstPipe } from '../../Pipes/capitalize-first.pipe';

@Component({
  selector: 'app-likelihood-impact-card',
  standalone: true,
  imports: [CommonModule,CapitalizeFirstPipe],
  templateUrl: './likelihood-impact-card.component.html',
  styleUrl: './likelihood-impact-card.component.scss'
})
export class LikelihoodImpactCardComponent {


  @Input() assessment:any ={};

  ngOnInit()
  {
    setTimeout(()=>{
      console.log("Datali",this.assessment)
    },1000)
  }







}
