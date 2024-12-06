import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }
  getRiskType(){
    return this.http.get(`data/type-dropdown.json`)
  }

  getRiskCurrentAssessment(){
    return this.http.get(`data/assessment-dropdown.json`)

  }
}
