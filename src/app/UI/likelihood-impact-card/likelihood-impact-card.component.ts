import { levelData } from './../../Interfaces/RiskInterFaces.interface';
import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { ILikelihood } from '../../Interfaces/RiskInterFaces.interface';

@Component({
  selector: 'app-likelihood-impact-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './likelihood-impact-card.component.html',
  styleUrl: './likelihood-impact-card.component.scss'
})
export class LikelihoodImpactCardComponent {

  @Input()  LikeliHoodlevel: keyof ILikelihood = "high";
  @Input()  Impactlevel: keyof ILikelihood = "high";
  @Input() impact=""

  likeLyHood:ILikelihood={
    low:{value:1,color:"green"},
    medium:{value:1,color:"orange"},
    high:{value:1,color:"yellow"},
    critical:{value:1,color:"red"}
  }

}
