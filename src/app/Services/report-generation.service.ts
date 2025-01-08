import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface RiskAssessment {
  assessmentBasis: string | null;
  id: number;
  matrixImpact: string;
  matrixLikelihood: string;
  reviewStatus: string;
  reviewer: string;
  riskFactor:number;
  // isMitigated: boolean;
}

interface Risk {
  // ... keeping same Risk interface ...
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
    mainHeader: {
      font: { bold: true, color: { argb: "FFFFFFFF" }, size: 12 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF1F4E78" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "medium", color: { argb: "FF000000" } },
        bottom: { style: "medium", color: { argb: "FF000000" } },
        left: { style: "medium", color: { argb: "FF000000" } },
        right: { style: "medium", color: { argb: "FF000000" } }
      }
    },
    assessmentHeader: {
      font: { bold: true, color: { argb: "FFFFFFFF" }, size: 11 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF4472C4" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
      }
    },
    subHeader: {
      font: { bold: true, color: { argb: "FFFFFFFF" }, size: 11 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF2F75B5" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
      }
    },
    cell: {
      font: { color: { argb: "FF000000" }, size: 11 },
      alignment: { vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
      }
    },
    highRisk: {
      font: { color: { argb: "FFFFFFFF" }, size: 11 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: "FFFF0000" } },
      alignment: { vertical: "middle", horizontal: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
      }
    },
    mediumRisk: {
      font: { color: { argb: "FF000000" }, size: 11 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: "FFFFFF00" } },
      alignment: { vertical: "middle", horizontal: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
      }
    },
    lowRisk: {
      font: { color: { argb: "FF000000" }, size: 11 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF00FF00" } },
      alignment: { vertical: "middle", horizontal: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
      }
    }
  };

  async generateReport(data: Risk[], fileName: string): Promise<void> {
    try {
      const workbook = new ExcelJS.Workbook();

      // Create sheets
      const qualitySheet = workbook.addWorksheet('Quality Risks');
      const securitySheet = workbook.addWorksheet('Security & Privacy Risks');

      // Set column widths
      const setColumnWidths = (sheet: ExcelJS.Worksheet, count: number) => {
        for (let i = 1; i <= count; i++) {
          sheet.getColumn(i).width = 15;
        }
      };

      setColumnWidths(qualitySheet, 21);
      setColumnWidths(securitySheet, 40);

      // Helper function to apply styles to a row
      const applyRowStyles = (row: ExcelJS.Row, styles: any) => {
        row.eachCell((cell) => {
          Object.assign(cell, styles);
        });
      };

      // Add headers to Security & Privacy sheet
      const addSecurityHeaders = (sheet: ExcelJS.Worksheet) => {
        // Main sections header
        const mainHeader = sheet.addRow(['Risk Information', 'Risk Assessment Matrix']);
        applyRowStyles(mainHeader, this.styles.mainHeader);
        sheet.mergeCells(1, 1, 1, 15);
        sheet.mergeCells(1, 16, 1, 40);

        // Pre/Post mitigation headers
        const mitigationHeader = sheet.addRow(Array(40).fill(''));
        applyRowStyles(mitigationHeader, this.styles.mainHeader);
        mitigationHeader.getCell(16).value = 'Pre-Mitigation Assessment';
        mitigationHeader.getCell(28).value = 'Post-Mitigation Assessment';
        sheet.mergeCells(2, 16, 2, 27);
        sheet.mergeCells(2, 28, 2, 40);

        // Assessment type headers
        const typeHeader = sheet.addRow(Array(40).fill(''));
        applyRowStyles(typeHeader, this.styles.assessmentHeader);
        const assessmentTypes = ['Confidentiality', 'Integrity', 'Privacy', 'Availability'];
        let col = 16;
        assessmentTypes.forEach(type => {
          typeHeader.getCell(col).value = type;
          sheet.mergeCells(3, col, 3, col + 2);
          col += 3;
        });
        col = 28;
        assessmentTypes.forEach(type => {
          typeHeader.getCell(col).value = type;
          sheet.mergeCells(3, col, 3, col + 2);
          col += 3;
        });

        // Column headers
        const columnHeaders = [
          'Risk ID', 'Risk Name', 'Department', 'Description', 'Risk Type',
          'Risk Status', 'Impact', 'Mitigation', 'Contingency', 'Risk Response',
          'Overall Risk Rating', 'Responsible User', 'Created By', 'Created At', 'Remarks'
        ];

        // const assessmentHeaders = Array(16).fill('').map((_, i) =>
        //   i % 2 === 0 ? 'Impact' : 'Likelihood':'riskfactor'
        // );
        const assessmentHeaders = ['Impact', 'Likelihood', 'Risk Factor','Impact', 'Likelihood', 'Risk Factor',
          'Impact', 'Likelihood', 'Risk Factor','Impact', 'Likelihood', 'Risk Factor',
        'Impact', 'Likelihood', 'Risk Factor','Impact', 'Likelihood', 'Risk Factor',
      'Impact', 'Likelihood', 'Risk Factor','Impact', 'Likelihood', 'Risk Factor'];

        const headerRow = sheet.addRow([...columnHeaders, ...assessmentHeaders]);
        applyRowStyles(headerRow, this.styles.subHeader);
      };

      // Add headers to Quality sheet
      const addQualityHeaders = (sheet: ExcelJS.Worksheet) => {
        // Main sections header
        const mainHeader = sheet.addRow(['Risk Information', 'Risk Assessment']);
        applyRowStyles(mainHeader, this.styles.mainHeader);
        sheet.mergeCells(1, 1, 1, 15);
        sheet.mergeCells(1, 16, 1, 21);

        // Pre/Post mitigation headers
        const mitigationHeader = sheet.addRow(Array(21).fill(''));
        applyRowStyles(mitigationHeader, this.styles.mainHeader);
        mitigationHeader.getCell(16).value = 'Pre-Mitigation Assessment';
        mitigationHeader.getCell(19).value = 'Post-Mitigation Assessment';
        sheet.mergeCells(2, 16, 2, 18);
        sheet.mergeCells(2, 19, 2, 21);

        // Column headers
        const columnHeaders = [
          'Risk ID', 'Risk Name', 'Department', 'Description', 'Risk Type',
          'Risk Status', 'Impact', 'Mitigation', 'Contingency', 'Risk Response',
          'Overall Risk Rating', 'Responsible User', 'Created By', 'Created At', 'Remarks',
          'Impact', 'Likelihood', 'Risk Factor','Impact', 'Likelihood', 'Risk Factor'
        ];

        const headerRow = sheet.addRow(columnHeaders);
        applyRowStyles(headerRow, this.styles.subHeader);
      };

      // Add headers to sheets
      addSecurityHeaders(securitySheet);
      addQualityHeaders(qualitySheet);

      // Process risk data
      data.forEach((risk) => {
        const formatDate = (dateString: string | null) => {
          if (!dateString) return '';
          return new Date(dateString).toLocaleString();
        };

        const baseRiskInfo = [
          risk.riskId || '',
          risk.riskName || '',
          risk.departmentName || '',
          risk.description || '',
          risk.riskType || '',
          risk.riskStatus || '',
          risk.impact || '',
          risk.mitigation || '',
          risk.contingency || '',
          risk.riskResponse || '',
          risk.overallRiskRating || '',
          risk.responsibleUser || '',
          risk.createdBy || '',
          formatDate(risk.createdAt),
          risk.remarks || ''
        ];

         // getting assessment values

        const getAssessmentDetails = (assessments: any[], basis: any, isMitigated: boolean) => {
          const assessment = assessments.find(a => a.assessmentBasis === basis && a.isMitigated === isMitigated);
          console.log(assessment)
          return { impact: assessment?.matrixImpact || '', likelihood: assessment?.matrixLikelihood || '',riskfactor:assessment?.riskFactor || '' };
        };

        // adding assessment values

        if (risk.riskType === 'Quality') {
          const preAssessment = getAssessmentDetails(risk.riskAssessments || [], null, false);
          const postAssessment = getAssessmentDetails(risk.riskAssessments || [], null, true);
          // const assessments = [];
          // assessments.push(
          //   preAssessment.impact,
          //   preAssessment.likelihood
          // );
          // assessments.push(
          //   postAssessment.impact,
          //   postAssessment.likelihood
          // );
          const row = qualitySheet.addRow([
            ...baseRiskInfo,
            preAssessment.impact,
            preAssessment.likelihood,
            preAssessment.riskfactor,
            postAssessment.impact,
            postAssessment.likelihood,
            postAssessment.riskfactor
          ]);

          applyRowStyles(row, this.styles.cell);
        } else if (risk.riskType === 'Security' || risk.riskType === 'Privacy') {
          const assessmentTypes = ['Confidentiality', 'Integrity', 'Privacy', 'Availability'];
          const oassessments = [];
          const eassessments = [];
          for (const type of assessmentTypes) {
            const preAssessment = getAssessmentDetails(risk.riskAssessments || [], type, false);
            const postAssessment = getAssessmentDetails(risk.riskAssessments || [], type, true);

            oassessments.push(
              preAssessment.impact,
              preAssessment.likelihood,
              preAssessment.riskfactor
            );
            eassessments.push(
              postAssessment.impact,
              postAssessment.likelihood,
              postAssessment.riskfactor
            );
          }

          const row = securitySheet.addRow([...baseRiskInfo, ...oassessments, ...eassessments]);
          applyRowStyles(row, this.styles.cell);
        }
      });


      // Generate and save file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `${fileName}.xlsx`);

    } catch (error) {
      console.error('Error generating Excel report:', error);
      throw new Error(`Failed to generate Excel report: ${error}`);
    }
  }
}
