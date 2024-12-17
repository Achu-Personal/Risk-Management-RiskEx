import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateServiceService {

  constructor() { }
dataSignal = signal<{ approve: string }>({ approve: '' });


  
  get data() {
    return this.dataSignal.asReadonly();
  }

 
  setData(value: { approve: string }): void {
    this.dataSignal.set(value);
  }
}
