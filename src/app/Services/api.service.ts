import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {



constructor(private http:HttpClient) { }
  //Just for now to test can be removed later
  getAllRisk()
  {
      return this.http.get("/data/getAllRisk.json");

  }
  getRiskType(){
    return this.http.get(`data/type-dropdown.json`)
  }

  getRiskCurrentAssessment(){
    return this.http.get(`data/assessment-dropdown.json`)
  }

  getRiskById(id:number)
  {
    return  this.http.get("/data/getAllRisk.json").pipe(map((data:any)=>{
      console.log(data)
     return  data.filter((item:any)=>item.id===id)[0]
    }));
  }

  getRisk()
  {
    console.log("hai")
      return this.http.get(`data/getRisk.json`);


  }
}
