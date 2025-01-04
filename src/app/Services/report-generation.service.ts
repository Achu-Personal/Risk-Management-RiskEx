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
  private readonly styles = {
    header1: {
      font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
      fill: { fgColor: { rgb: "1F4E78" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "medium", color: { rgb: "000000" } },
        bottom: { style: "medium", color: { rgb: "000000" } },
        left: { style: "medium", color: { rgb: "000000" } },
        right: { style: "medium", color: { rgb: "000000" } }
      }
    },
    header2: {
      font: { bold: true, color: { rgb: "FFFFFF" }, size: 11 },
      fill: { fgColor: { rgb: "2F75B5" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    },
    header3: {
      font: { bold: true, color: { rgb: "000000" }, size: 11 },
      fill: { fgColor: { rgb: "BDD7EE" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    },
    cell: {
      font: { color: { rgb: "000000" }, size: 11 },
      alignment: { vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    }
  };

  generateReport(data: Risk[], fileName: string): void {
    try {
      const workbook: XLSX.WorkBook = { SheetNames: [], Sheets: {} };

      const headerRow1 = [
        { v: 'Risk Mitigation', s: this.styles.header1 },
        { v: 'Risk Contingency', s: this.styles.header1 },
        { v: 'Responsibility Of The Action', s: this.styles.header1 },
        { v: 'Planned Action Date', s: this.styles.header1 },
        { v: 'Assessment Response Details', s: this.styles.header1 },
        { v: 'Actual Closed Date', s: this.styles.header1 },
        { v: 'Risk Response', s: this.styles.header1 },
        { v: 'Risk Status', s: this.styles.header1 },
        { v: 'Remarks', s: this.styles.header1 }
      ];

      const headerRow2 = [
        { v: '', s: this.styles.header2 },
        { v: '', s: this.styles.header2 },
        { v: '', s: this.styles.header2 },
        { v: '', s: this.styles.header2 },
        { v: 'Confidentiality P1', s: this.styles.header2 },
        { v: 'Integrity P1', s: this.styles.header2 },
        { v: 'Privacy P1', s: this.styles.header2 },
        { v: 'Availability P1', s: this.styles.header2 },
        { v: 'Overall Risk Rating', s: this.styles.header2 },
        { v: '', s: this.styles.header2 },
        { v: '', s: this.styles.header2 },
        { v: '', s: this.styles.header2 },
        { v: '', s: this.styles.header2 }
      ];

      const headerRow3 = [
        { v: '', s: this.styles.header3 },
        { v: '', s: this.styles.header3 },
        { v: '', s: this.styles.header3 },
        { v: '', s: this.styles.header3 },
        { v: 'Risk Factor', s: this.styles.header3 },
        { v: 'Likelihood', s: this.styles.header3 },
        { v: 'R=Rs x Ls', s: this.styles.header3 },
        { v: 'Risk Factor', s: this.styles.header3 },
        { v: 'Likelihood', s: this.styles.header3 },
        { v: 'R=Rs x Ls', s: this.styles.header3 },
        { v: 'Risk Factor', s: this.styles.header3 },
        { v: 'Likelihood', s: this.styles.header3 },
        { v: 'R=Rs x Ls', s: this.styles.header3 },
        { v: 'Risk Factor', s: this.styles.header3 },
        { v: 'Likelihood', s: this.styles.header3 },
        { v: 'R=Rs x Ls', s: this.styles.header3 },
        { v: 'R = R1 + R2 + R3 + R4', s: this.styles.header3 }
      ];

      const qualitySheetData: any[][] = [];
      const securityPrivacySheetData: any[][] = [];

      // Process risks with styled cells
      data.forEach((risk) => {
        const riskRow = this.createStyledRiskRow(risk);
        if (risk.riskType === 'Quality') {
          qualitySheetData.push(riskRow);
        } else if (risk.riskType === 'Security' || risk.riskType === 'Privacy') {
          securityPrivacySheetData.push(riskRow);
        }
      });

      // Create sheets with enhanced styling
      const qualitySheet = this.createStyledSheet(headerRow1, headerRow2, headerRow3, qualitySheetData);
      const securityPrivacySheet = this.createStyledSheet(headerRow1, headerRow2, headerRow3, securityPrivacySheetData);

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

  private createStyledSheet(headerRow1: any[], headerRow2: any[], headerRow3: any[], data: any[][]): XLSX.WorkSheet {
    const ws = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2, headerRow3, ...data]);

    // Define merged cell ranges
    ws['!merges'] = [
      { s: { r: 0, c: 4 }, e: { r: 0, c: 16 } },  // Assessment Response Details
      { s: { r: 1, c: 4 }, e: { r: 1, c: 6 } },   // Confidentiality
      { s: { r: 1, c: 7 }, e: { r: 1, c: 9 } },   // Integrity
      { s: { r: 1, c: 10 }, e: { r: 1, c: 12 } }, // Privacy
      { s: { r: 1, c: 13 }, e: { r: 1, c: 15 } }  // Availability
    ];

    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // Risk Mitigation
      { wch: 30 }, // Risk Contingency
      { wch: 25 }, // Responsibility
      { wch: 15 }, // Planned Action Date
      { wch: 15 }, // Risk Factor
      { wch: 15 }, // Likelihood
      { wch: 15 }, // Risk Score
      { wch: 15 }, // Risk Factor
      { wch: 15 }, // Likelihood
      { wch: 15 }, // Risk Score
      { wch: 15 }, // Risk Factor
      { wch: 15 }, // Likelihood
      { wch: 15 }, // Risk Score
      { wch: 15 }, // Risk Factor
      { wch: 15 }, // Likelihood
      { wch: 15 }, // Risk Score
      { wch: 15 }, // Overall Rating
      { wch: 15 }, // Closed Date
      { wch: 20 }, // Risk Response
      { wch: 15 }, // Risk Status
      { wch: 30 }  // Remarks
    ];

    // Set row heights
    ws['!rows'] = Array(data.length + 3).fill({ hpt: 30 }); // 30 point height for all rows

    return ws;
  }

  private createStyledRiskRow(risk: Risk): any[] {
    const getAssessmentDetails = (basis: string) => {
      const assessment = risk.riskAssessments.find(a => a.assessmentBasis === basis);
      return {
        impact: assessment?.matrixImpact || '',
        likelihood: assessment?.matrixLikelihood || '',
        riskScore: assessment ? this.calculateRiskScore(assessment.matrixImpact, assessment.matrixLikelihood) : ''
      };
    };

    const confidentiality = getAssessmentDetails('Confidentiality');
    const integrity = getAssessmentDetails('Integrity');
    const privacy = getAssessmentDetails('Privacy');
    const availability = getAssessmentDetails('Availability');

    return [
      { v: risk.mitigation, s: this.styles.cell },
      { v: risk.contingency, s: this.styles.cell },
      { v: risk.responsibleUser, s: this.styles.cell },
      { v: risk.plannedActionDate, s: this.styles.cell },
      { v: confidentiality.impact, s: this.styles.cell },
      { v: confidentiality.likelihood, s: this.styles.cell },
      { v: confidentiality.riskScore, s: this.styles.cell },
      { v: integrity.impact, s: this.styles.cell },
      { v: integrity.likelihood, s: this.styles.cell },
      { v: integrity.riskScore, s: this.styles.cell },
      { v: privacy.impact, s: this.styles.cell },
      { v: privacy.likelihood, s: this.styles.cell },
      { v: privacy.riskScore, s: this.styles.cell },
      { v: availability.impact, s: this.styles.cell },
      { v: availability.likelihood, s: this.styles.cell },
      { v: availability.riskScore, s: this.styles.cell },
      { v: risk.overallRiskRating, s: this.styles.cell },
      { v: risk.closedDate, s: this.styles.cell },
      { v: risk.riskResponse, s: this.styles.cell },
      { v: risk.riskStatus, s: this.styles.cell },
      { v: risk.remarks, s: this.styles.cell }
    ];
  }

  private calculateRiskScore(impact: string, likelihood: string): number {
    const impactMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const likelihoodMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return (impactMap[impact as keyof typeof impactMap] || 0) *
           (likelihoodMap[likelihood as keyof typeof likelihoodMap] || 0);
  }
}
