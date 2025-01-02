import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Define the RiskAssessment interface
interface RiskAssessment {
  assessmentBasis: string;
  matrixImpact: string;
  matrixLikelihood: string;
  reviewStatus: string;
  reviewer: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportGenerationService {
  // Method to generate and download an Excel file
  generateReport(data: any[], fileName: string): void {
    try {
      const workbook: XLSX.WorkBook = { SheetNames: [], Sheets: {} };

      // Define the sheet's headers with multi-level columns for Risk Assessment
      const headerRow1 = [
        'RiskName', 'RiskId', 'RiskType', 'RiskStatus', 'DepartmentName', 'Impact', 'Mitigation', 'Contingency', 'OverallRiskRating', 'ResponsibleUser', 'Email', 'CreatedAt', 'UpdatedAt',
        // Multi-level Risk Assessment header
        'Risk Assessment (Confidentiality - Matrix Impact)', 'Risk Assessment (Confidentiality - Matrix Likelihood)',
        'Risk Assessment (Integrity - Matrix Impact)', 'Risk Assessment (Integrity - Matrix Likelihood)'
      ];

      // Prepare data for the Quality sheet and the Security/Privacy sheet
      const qualitySheetData: any[][] = [headerRow1]; // For Quality risks
      const securityPrivacySheetData: any[][] = [headerRow1]; // For Security and Privacy risks

      // Iterate through each risk and add it to the appropriate sheet
      data.forEach((risk) => {
        const riskRow = [
          risk.riskName,
          risk.id,
          risk.riskType,
          risk.riskStatus,
          risk.departmentName,
          risk.impact,
          risk.mitigation,
          risk.contingency,
          risk.overallRiskRating,
          risk.responsibleUser,
          risk.email,
          risk.createdAt,
          risk.updatedAt,
          // Populate the Risk Assessment columns based on the assessment basis
          risk.riskAssessments.map((assessment: any) =>
            assessment.assessmentBasis === 'Confidentiality' ? assessment.matrixImpact : ''
          ).join(", "),
          risk.riskAssessments.map((assessment: any) =>
            assessment.assessmentBasis === 'Confidentiality' ? assessment.matrixLikelihood : ''
          ).join(", "),
          risk.riskAssessments.map((assessment: any) =>
            assessment.assessmentBasis === 'Integrity' ? assessment.matrixImpact : ''
          ).join(", "),
          risk.riskAssessments.map((assessment: any) =>
            assessment.assessmentBasis === 'Integrity' ? assessment.matrixLikelihood : ''
          ).join(", ")
        ];

        // If the risk type is "Quality", add it to the quality sheet
        if (risk.riskType === 'Quality') {
          qualitySheetData.push(riskRow);
        }

        // If the risk type is "Security" or "Privacy", add it to the security/privacy sheet
        if (risk.riskType === 'Security' || risk.riskType === 'Privacy') {
          securityPrivacySheetData.push(riskRow);
        }
      });

      // Convert data to sheets
      const qualitySheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(qualitySheetData);
      const securityPrivacySheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(securityPrivacySheetData);

      // Add sheets to the workbook
      const qualitySheetName = `Quality Risks`;
      const securityPrivacySheetName = `Security & Privacy Risks`;

      workbook.SheetNames.push(qualitySheetName, securityPrivacySheetName);
      workbook.Sheets[qualitySheetName] = qualitySheet;
      workbook.Sheets[securityPrivacySheetName] = securityPrivacySheet;

      // Generate the Excel file
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      // Create Blob and trigger download
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `${fileName}.xlsx`);

    } catch (error) {
      console.error('Error generating Excel report:', error);
    }
  }


}
