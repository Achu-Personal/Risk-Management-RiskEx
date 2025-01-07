import { project } from './../Interfaces/projects.interface';
import { department } from './../Interfaces/deparments.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UserResponse } from '../Interfaces/Userdata.interface.';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, public auth: AuthService) {}
  //Just for now to test can be removed later
  getAllRisk() {
    return this.http.get('/data/getAllRisk.json');
  }
  getRiskType() {
    return this.http.get(`data/type-dropdown.json`);
  }

  getRiskCurrentAssessment() {
    return this.http.get(`data/assessment-dropdown.json`);
  }

  getRiskById(id: number) {
    return this.http.get(`https://localhost:7216/api/Risk/id?id=${id}`);
  }
  getMitigationSatus(id: string) {
    return this.http.get(
      `https://localhost:7216/api/Risk/GetMitigationStatusOfARisk/${id}`
    );
  }
  getReviewSatus(id: string, isPreReview: boolean) {
    return this.http.get(
      `https://localhost:7216/api/Review/GetReviewStatusOfARisk/${id}/${isPreReview}`
    );
  }
  getDepartment() {
    return this.http.get<department[]>(
      'https://localhost:7216/api/Department/Departments'
    );
  }

  addNewDepartment(department: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      'https://localhost:7216/api/Department/Department',
      department
    );
  }

  getProjects(departmentName: string) {
    return this.http.get<project[]>(
      `https://localhost:7216/api/Project/ProjectsBy/${departmentName}`
    );
  }

  gettabledata() {
    return this.http.get(`https://localhost:7216/api/Report`);
  }
  gethistorytabledata(){
    return this.http.get(`https://localhost:7216/api/Report?riskStatus=close`)
  }
  getDepartmentTable(department:any) {
    return this.http.get(`https://localhost:7216/api/Report/DepartmentwiseRisk/${department}`)
  }
  getDepartmentHistoryTable(department:any) {
    return this.http.get(`https://localhost:7216/api/Report/DepartmentwiseRisk/${department}?riskStatus=close`)
  }
  getProjectTable(projectList:any) {
    // let params = new HttpParams();
    // projectList.forEach((id) => {
    //   params = params.append('projectIds', id);
    // });
    return this.http.get(`https://localhost:7216/api/Report/projectrisks?projectIds=${projectList}`)
  }
  addNewProject(project: any) {
    return this.http.post(
      'https://localhost:7216/api/Project/Project',
      project
    );
  }
  addNewUser(user: any) {
    return this.http.post<UserResponse>(
      'https://localhost:7216/api/User/register',
      user,
      {
        responseType: 'text' as 'json',
      }
    );
  }

  getRisk() {
    console.log('hai');
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
    console.log("quality risk payload",qualityRisk)
     return this.http.post('https://localhost:7216/api/Risk/Quality',qualityRisk)
   }

   addnewSecurityOrPrivacyRisk(SecurityOrPrivacyRisk:any){

    return this.http.post('https://localhost:7216/api/Risk/security',SecurityOrPrivacyRisk)
   }
   addExternalReviewer(reviewer:any){
    return this.http.post('https://localhost:7216/api/Reviewer/add-reviewer',reviewer)
   }
   addResponsiblePerson(assignee:any){
    return this.http.post('https://localhost:7216/api/User/register',assignee)
   }
   getAllReviewer(){
    return this.http.get('https://localhost:7216/api/Reviewer/getAllReviewers')
   }
   editQualityRisk(id:number,risk:any){
    return this.http.put(`https://localhost:7216/api/Risk/quality/${id}`,risk)
   }
   editSecurityOrPrivacyRisk(id:number,risk:any){
    return this.http.put(`https://localhost:7216/api/Risk/SecurityOrPrivacy/${id}`,risk)
   }

  getRisksAssignedToUser(id: any = '') {
    return this.http.get(
      `https://localhost:7216/api/Risk/GetRiskByAssigne?id=${id}`
    );
  }

  getRisksByReviewerId() {
    const userId = this.auth.getCurrentUserId();
    return this.http.get(
      `https://localhost:7216/api/Approval/Approval${userId}`
    );
  }
  getAllRisksTobeReviewed() {
    return this.http.get(
      'https://localhost:7216/api/Approval/RisksToBeReviewed'
    );
  }
  updateRiskReviewStatus(riskId: number, approvalStatus: string) {
    const url = `https://localhost:7216/api/Approval/update-review-status?riskId=${riskId}&approvalStatus=${approvalStatus}`;
    return this.http.put(url, {});
  }
  updateReviewStatusAndComments(id: number, updates: any) {
    console.log('updates', updates);

    this.http
      .put(`https://localhost:7216/api/Approval/update-review/${id}`, updates)
      .subscribe((e) => console.log(e));
  }
  sendEmailToAssignee(id: number) {
    this.http
      .post(`https://localhost:7216/api/emails/send-assignment-email/${id}`, {})
      .subscribe((e) => console.log(e));
  }

  getRisksWithHeigestOverallRating(id: any = '') {
    return this.http.get(
      `https://localhost:7216/api/Risk/GetRiskWithHeighestOverallRationg?id=${id}`
    );
  }

  getRiskApproachingDeadline(id: any = '') {
    return this.http.get(
      `https://localhost:7216/api/Risk/GetRiskApproachingDeadline?id=${id}`
    );
  }

  getAllUsers() {
    return this.http.get('https://localhost:7216/api/User/GetAllUsers');
  }

  getAllUsersByDepartmentName(department: string) {
    return this.http.get(
      `https://localhost:7216/api/User/GetUsersByDepartment/${department}`
    );
  }

  getAllUsersForAssignee() {
    return this.http.get('https://localhost:7216/Users');
  }

  getAllUsersByDepartmentId(id: number) {
    return this.http.get(`https://localhost:7216/department/${id}`);
  }

  getRiskCategoryCountsByDepartment(departmentList: number[]) {
    let params = new HttpParams();
    departmentList.forEach((departmentId) => {
      params = params.append('departmentList', departmentId.toString());
    });

    return this.http.get(
      'https://localhost:7216/api/Risk/RiskCategoryCountByDepartment',
      { params }
    );
  }

  changeUserStatus(userId:any,status:any){
    return this.http.patch(`https://localhost:7216/api/User/IsActive/${userId}/${status}`,{}).subscribe((e)=>console.log('UserId and status:',userId,status)
    )
  }

 }
