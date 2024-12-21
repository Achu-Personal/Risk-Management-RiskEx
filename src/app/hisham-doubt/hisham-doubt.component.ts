import { Component } from '@angular/core';

@Component({
  selector: 'app-hisham-doubt',
  standalone: true,
  imports: [],
  templateUrl: './hisham-doubt.component.html',
  styleUrl: './hisham-doubt.component.scss'
})
export class HishamDoubtComponent {

likelyHood:any = [
  {name:'low',
    val:0.2
  },
  {name:'medium',
    val:0.4
  },
  {name:'high',
    val:0.6
  },
  {name:'critical',
    val:0.8
  }
];
impact:any=[
  {
  name:'low',
    val:20
  
},
{name:'medium',
  val:40
},
{name:'high',
  val:60
},
{name:'medium',
  val:80
}
];

onDimensionChange(event: Event): void {
  const selectedValue = (event.target as HTMLSelectElement).value;

  if (selectedValue === 'low') {
    
  }

}
}