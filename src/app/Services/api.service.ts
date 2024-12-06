import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}
