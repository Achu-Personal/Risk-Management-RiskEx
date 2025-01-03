import { department } from './../Interfaces/deparments.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { project } from '../Interfaces/projects.interface';
import { UserResponse } from '../Interfaces/Userdata.interface.';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


constructor(private http:HttpClient, public auth:AuthService) { }
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
     return  this.http.get(`https://localhost:7216/api/Risk/id?id=${id}`);
   }
   getMitigationSatus(id:string)
   {
    return  this.http.get(`https://localhost:7216/api/Risk/GetMitigationStatusOfARisk/${id}`);
   }
   getReviewSatus(id:string,isPreReview:boolean)
   {
    return  this.http.get(`https://localhost:7216/api/Review/GetReviewStatusOfARisk/${2}/${isPreReview}`);
   }
   getDepartment() {
     return this.http.get<department[]>('https://localhost:7216/api/Department/Departments');
   }

   addNewDepartment(department: any): Observable<{ message: string }> {
     return this.http.post<{ message: string }>('https://localhost:7216/api/Department/Department', department);
   }

   getProjects(departmentName: string) {
     return this.http.get<project[]>(`https://localhost:7216/api/Project/ProjectsBy/${departmentName}`);
   }

   gettabledata(){
    //  return this.http.get(`data/tabledata.json`)
    return this.http.get(`https://localhost:7216/api/Report`)
   }
   getFilteredData(department: any) {
     return this.http.get(`data/tabledata.json`).pipe(
       map((data:any) => {
         const filteredData = data.filter((item:any) => item.department.toLowerCase() === String( department).toLowerCase());
         return filteredData;
       })
     );
   }
   addNewProject(project:any){
     return this.http.post("https://localhost:7216/api/Project/Project",project)
   }
   addNewUser(user: any) {
    return this.http.post<UserResponse>(
      "https://localhost:7216/api/User/register",
      user,
      {
        // Add this to handle text responses
        responseType: 'text' as 'json'
      }
    );
  }

   getRisk()
   {
     console.log("hai")
       return this.http.get(`data/getRisk.json`);


   }
   getRiskResponses(){

    return this.http.get('https://localhost:7216/api/RiskResponseData')
   }
   getLikelyHoodDefinition(){
    return this.http.get('https://localhost:7216/api/AssessmentMatrixLikelihood')
   }
   getImpactDefinition(){
    return this.http.get('https://localhost:7216/api/AssessmentMatrixImpact')
   }
   getRiskCategoryCounts(){
    return this.http.get('https://localhost:7216/api/Risk/RiskCategory-Counts')
   }
   getOpenRiskCountByType(){
    return this.http.get('https://localhost:7216/api/Risk/OpenRisk-Counts')
   }

   addnewQualityRisk(qualityRisk:any){
    return this.http.get('https://localhost:7216/api/Risk/Quality',qualityRisk)
   }

   getRisksAssignedToUser(id:any='')
   {


    return this.http.get(`https://localhost:7216/api/Risk/GetRiskByAssigne/${id}`)
   }


   getRisksByReviewerId(){
    const userId= this.auth.getCurrentUserId()
    return this.http.get(`https://localhost:7216/api/Approval/Approval${userId}`)
   }
   getAllRisksTobeReviewed(){
    return this.http.get('https://localhost:7216/api/Approval/RisksToBeReviewed');
   }
   updateRiskReviewStatus(riskId: number, approvalStatus: string) {
    // Construct the API URL with query parameters
    const url = `https://localhost:7216/api/Approval/update-review-status?riskId=${riskId}&approvalStatus=${approvalStatus}`;

    // Make the HTTP PUT request
    return this.http.put(url, {});
  }
  updateReviewStatusAndComments(id:number, updates:any){
    console.log("updates",updates);
    
    this.http.put(`https://localhost:7216/api/Approval/update-review/${id}`,updates).subscribe(e => console.log(e)
    );

  }
  sendEmailToAssignee(id:number){
    this.http.post(`https://localhost:7216/api/emails/send-assignment-email/${id}`,{}).subscribe(e => console.log(e));
  }
  getAllUsers(){
    return this.http.get('https://localhost:7216/api/User/GetAllUsers');
  }
  
  getAllUsersByDepartmentName(department:string){
    return this.http.get(`https://localhost:7216/api/User/GetUsersByDepartment/${department}`)
  }
 }
