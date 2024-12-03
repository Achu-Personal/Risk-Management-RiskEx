import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http:HttpClient) { }


  //Just for now to test can be removed later
  getAllRisk()
  {
      return this.http.get("/data/getAllRisk.json");
  }
}
