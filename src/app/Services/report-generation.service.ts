import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface RiskAssessment {
  assessmentBasis: string | null;
  id: number;
  matrixImpact: string;
  matrixLikelihood: string;
  reviewStatus: string;
  reviewer: string;
}

interface Risk {
  closedDate: string;
  contingency: string;
  createdAt: string;
  createdBy: string;
  departmentId: number;
  departmentName: string;
  description: string;
  email: string;
  id: number;
  impact: string;
  mitigation: string;
  overallRiskRating: number;
  plannedActionDate: string;
  projectId: number | null;
  remarks: string;
  responsibleUser: string;
  responsibleUserId: number;
  riskAssessments: RiskAssessment[];
  riskId: string;
  riskName: string;
  riskResponse: string;
  riskStatus: string;
  riskType: string;
  updatedAt: string;
  updatedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportGenerationService {
  generateReport(data: Risk[], fileName: string): void {
    try {
      const workbook: XLSX.WorkBook = { SheetNames: [], Sheets: {} };

      // Define header styles
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "0000FF" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      };

      // Define the main headers
      const headerRow1 = [
        { v: 'Risk Mitigation', s: headerStyle },
        { v: 'Risk Contingency', s: headerStyle },
        { v: 'Responsibility Of The Action', s: headerStyle },
        { v: 'Planned Action date', s: headerStyle },
        // Assessment Categories
        { v: 'Assessment Response Details', s: headerStyle },
        { v: 'Actual Closed date', s: headerStyle },
        { v: 'Risk Response', s: headerStyle },
        { v: 'Risk Status', s: headerStyle },
        { v: 'Remarks', s: headerStyle }
      ];

      // Define sub-headers for assessment details
      const headerRow2 = [
        '', '', '', '',  // Empty cells for non-assessment columns
        // Confidentiality P1
        { v: 'Confidentiality P1', s: headerStyle },
        { v: 'Integrity P1', s: headerStyle },
        { v: 'Privacy P1', s: headerStyle },
        { v: 'Availability P1', s: headerStyle },
        { v: 'Overall Risk Rating', s: headerStyle },
        '', '', '', ''  // Empty cells for remaining columns
      ];

      // Define the risk factor headers
      const headerRow3 = [
        '', '', '', '',  // Empty cells for non-assessment columns
        // Risk Factors for each category
        'Risk Factor',
        'Likelihood',
        'R=Rs x Ls',
        'Risk Factor',
        'Likelihood',
        'R=Rs x Ls',
        'Risk Factor',
        'Likelihood',
        'R=Rs x Ls',
        'Risk Factor',
        'Likelihood',
        'R=Rs x Ls',
        'R = R1 + R2 + R3 + R4',
        '', '', '', ''  // Empty cells for remaining columns
      ];

      const qualitySheetData: any[][] = [];
      const securityPrivacySheetData: any[][] = [];

      // Process each risk
      data.forEach((risk) => {
        const getAssessmentDetails = (basis: string) => {
          const assessment = risk.riskAssessments.find(a => a.assessmentBasis === basis);
          return {
            impact: assessment?.matrixImpact || '',
            likelihood: assessment?.matrixLikelihood || '',
            riskScore: assessment ? calculateRiskScore(assessment.matrixImpact, assessment.matrixLikelihood) : ''
          };
        };

        const confidentiality = getAssessmentDetails('Confidentiality');
        const integrity = getAssessmentDetails('Integrity');
        const privacy = getAssessmentDetails('Privacy');
        const availability = getAssessmentDetails('Availability');

        const riskRow = [
          risk.mitigation,
          risk.contingency,
          risk.responsibleUser,
          risk.plannedActionDate,
          // Assessment details
          confidentiality.impact,
          confidentiality.likelihood,
          confidentiality.riskScore,
          integrity.impact,
          integrity.likelihood,
          integrity.riskScore,
          privacy.impact,
          privacy.likelihood,
          privacy.riskScore,
          availability.impact,
          availability.likelihood,
          availability.riskScore,
          risk.overallRiskRating,
          risk.closedDate,
          risk.riskResponse,
          risk.riskStatus,
          risk.remarks
        ];

        if (risk.riskType === 'Quality') {
          qualitySheetData.push(riskRow);
        } else if (risk.riskType === 'Security' || risk.riskType === 'Privacy') {
          securityPrivacySheetData.push(riskRow);
        }
      });

      // Function to calculate risk score (customize as needed)
      function calculateRiskScore(impact: string, likelihood: string): number {
        const impactMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
        const likelihoodMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (impactMap[impact as keyof typeof impactMap] || 0) *
               (likelihoodMap[likelihood as keyof typeof likelihoodMap] || 0);
      }

      // Function to create sheet with merged headers
      const createSheetWithHeaders = (data: any[][]) => {
        const ws = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2, headerRow3, ...data]);

        // Define merged cell ranges
        ws['!merges'] = [
          // Assessment Response Details merge
          { s: { r: 0, c: 4 }, e: { r: 0, c: 16 } },
          // Category merges (P1, P2, etc.)
          { s: { r: 1, c: 4 }, e: { r: 1, c: 6 } },  // Confidentiality
          { s: { r: 1, c: 7 }, e: { r: 1, c: 9 } },  // Integrity
          { s: { r: 1, c: 10 }, e: { r: 1, c: 12 } }, // Privacy
          { s: { r: 1, c: 13 }, e: { r: 1, c: 15 } }  // Availability
        ];

        // Set column widths
        ws['!cols'] = Array(21).fill({ wch: 15 });

        return ws;
      };

      // Create sheets
      const qualitySheet = createSheetWithHeaders(qualitySheetData);
      const securityPrivacySheet = createSheetWithHeaders(securityPrivacySheetData);

      // Add sheets to workbook
      workbook.SheetNames.push('Quality Risks', 'Security & Privacy Risks');
      workbook.Sheets['Quality Risks'] = qualitySheet;
      workbook.Sheets['Security & Privacy Risks'] = securityPrivacySheet;

      // Generate and download file
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `${fileName}.xlsx`);

    } catch (error) {
      console.error('Error generating Excel report:', error);
      throw new Error(`Failed to generate Excel report: ${error}`);
    }
  }
}
