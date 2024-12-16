import { department } from './../Interfaces/deparments.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { project } from '../Interfaces/projects.interface';

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
  getDepartment() {
    return this.http.get<department[]>('https://localhost:7150/api/Department/GetAllDepartments');
  }

  addNewDepartment(department: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('https://localhost:7150/api/Department/AddDepartment', department);
  }

  getProjects(departmentName: string) {
    return this.http.get<project[]>(`https://localhost:7150/api/Project/GetProjectsByDepartment/${departmentName}`);
  }

  gettabledata(){
    return this.http.get(`data/tabledata.json`)
  }
  getFilteredData(department: any) {
    return this.http.get(`data/tabledata.json`).pipe(
      map((data:any) => {
        const filteredData = data.filter((item:any) => item.department.toLowerCase() === String( department).toLowerCase());
        return filteredData;
      })
    );
  }

}
