import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { firstValueFrom } from 'rxjs';

interface RiskAssessment {
  assessmentBasis: string | null;
  id: number;
  matrixImpact: string;
  matrixLikelihood: string;
  reviewStatus: string;
  reviewer: string;
  riskFactor: number;
  isMitigated: boolean;
}

interface Risk {
  closedDate: string;
  isoClauseNumber: string;
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
  overallRiskRatingAfter: number;
  overallRiskRatingBefore: number;
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
  percentageRedution?: string;
  residualRisk?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportGenerationService {
  private readonly TEMPLATE_PATH = 'assets/Risk (3).xlsx';

  constructor(private http: HttpClient) {}

  private readonly styles = {
    cell: {
      font: { color: { argb: "FF000000" }, size: 11 },
      alignment: { vertical: 'middle' as 'middle', wrapText: true },
      border: {
        top: { style: 'thin' as ExcelJS.BorderStyle, color: { argb: "FF000000" } },
        bottom: { style: 'thin' as ExcelJS.BorderStyle, color: { argb: "FF000000" } },
        left: { style: 'thin' as ExcelJS.BorderStyle, color: { argb: "FF000000" } },
        right: { style: 'thin' as ExcelJS.BorderStyle, color: { argb: "FF000000" } }
      }
    }
  };

  async generateReport(data: Risk[], fileName: string): Promise<void> {
    try {
      console.log('Starting report generation..., data length:', data);
      console.log('Total risks to process:', data.length);

      // Load the template
      const workbook = await this.loadTemplate();

      // Get the sheets with correct names
      const qualitySheet = workbook.getWorksheet('QMS RiskRegister');
      const securitySheet = workbook.getWorksheet('ISMS Risk Register');

      if (!qualitySheet || !securitySheet) {
        const availableSheets = workbook.worksheets.map(ws => ws.name).join(', ');
        throw new Error(
          `Required sheets not found. Available sheets: ${availableSheets}. ` +
          `Expected: "QMS RiskRegister" and "ISMS Risk Register"`
        );
      }

      // Set the correct starting rows for each sheet
      const QUALITY_START_ROW = 6;  // Quality data starts at row 6
      const SECURITY_START_ROW = 4;  // Security/Privacy data starts at row 4

      console.log('QMS data will start at row:', QUALITY_START_ROW);
      console.log('ISMS data will start at row:', SECURITY_START_ROW);

      let qualityRowIndex = QUALITY_START_ROW;
      let securityRowIndex = SECURITY_START_ROW;
      let qualitySlNo = 1;  // Serial number counter for Quality
      let securitySlNo = 1; // Serial number counter for Security/Privacy

      // Count risks by type
      const qualityRisks = data.filter(r => r.riskType === 'Quality');
      const securityRisks = data.filter(r => r.riskType === 'Security' || r.riskType === 'Privacy');

      console.log('Quality risks:', qualityRisks.length);
      console.log('Security/Privacy risks:', securityRisks.length);

      // Process risk data
      data.forEach((risk, index) => {
        if (risk.riskType === 'Quality') {
          console.log(`Processing Quality risk ${index + 1}: ${risk.riskId} at row ${qualityRowIndex}`);
          const rowData = this.prepareQualityRowData(risk, qualitySlNo);
          this.populateRow(qualitySheet, qualityRowIndex, rowData);
          qualityRowIndex++;
          qualitySlNo++;
        } else if (risk.riskType === 'Security' || risk.riskType === 'Privacy') {
          console.log(`Processing Security/Privacy risk ${index + 1}: ${risk.riskId} at row ${securityRowIndex}`);
          const rowData = this.prepareSecurityRowData(risk, securitySlNo);
          this.populateRow(securitySheet, securityRowIndex, rowData);
          securityRowIndex++;
          securitySlNo++;
        }
      });

      console.log('All risks processed. Generating file...');

      // Generate and save file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `${fileName}.xlsx`);

      console.log('Report generated successfully!');

    } catch (error) {
      console.error('Error generating Excel report:', error);
      throw new Error(`Failed to generate Excel report: ${error}`);
    }
  }

  private findDataStartRow(sheet: ExcelJS.Worksheet): number {
    // Look for a row that contains header text, then return the next row
    for (let rowNum = 1; rowNum <= 20; rowNum++) {
      const row = sheet.getRow(rowNum);
      const firstCell = row.getCell(1).value?.toString().toLowerCase() || '';
      const secondCell = row.getCell(2).value?.toString().toLowerCase() || '';

      // Check for common header keywords
      if (firstCell.includes('sl') ||
          firstCell.includes('no') ||
          firstCell.includes('risk') ||
          secondCell.includes('risk') ||
          firstCell.includes('s.no')) {
        console.log(`Found header at row ${rowNum}, data will start at row ${rowNum + 1}`);
        return rowNum + 1;
      }
    }

    // Default to row 10 if no header found
    console.warn('No header found, defaulting to row 10');
    return 10;
  }

  private prepareQualityRowData(risk: Risk, slNo: number): any[] {
    // QMS Sheet columns
    const preAssessment = this.getAssessmentDetails(risk.riskAssessments || [], null, false);
    const postAssessment = this.getAssessmentDetails(risk.riskAssessments || [], null, true);

    return [
      slNo,  // Changed from hardcoded 1 to dynamic slNo
      risk.riskId || '',
      risk.description || '',
      risk.impact || '',
      risk.isoClauseNumber || '',
      preAssessment.likelihood,
      preAssessment.impact,
      preAssessment.riskfactor,
      risk.riskResponse || '',
      risk.mitigation || '',
      risk.contingency || '',
      risk.responsibleUser || '',
      risk.plannedActionDate || '',
      risk.closedDate || '',
      postAssessment.likelihood,
      postAssessment.impact,
      postAssessment.riskfactor,
      risk.residualRisk || '',
      risk.percentageRedution || '',
      risk.riskStatus || '',
      risk.remarks || ''
    ];
  }

  private prepareSecurityRowData(risk: Risk, slNo: number): any[] {
    // ISMS Sheet columns
    const assessmentTypes = ['Confidentiality', 'Integrity', 'Privacy', 'Availability'];
    const preAssessments = [];
    const postAssessments = [];

    for (const type of assessmentTypes) {
      const preAssessment = this.getAssessmentDetails(risk.riskAssessments || [], type, false);
      const postAssessment = this.getAssessmentDetails(risk.riskAssessments || [], type, true);

      preAssessments.push(
        preAssessment.impact,
        preAssessment.likelihood,
        preAssessment.riskfactor
      );
      postAssessments.push(
        postAssessment.impact,
        postAssessment.likelihood,
        postAssessment.riskfactor
      );
    }

    return [
      // Added serial number as first column
      '',
      slNo,  // Changed from hardcoded 1 to dynamic slNo
      risk.riskId || '',
      risk.description || '',
      risk.riskType || '',
      risk.impact || '',
      risk.isoClauseNumber || '',
       ...preAssessments,
      risk.overallRiskRatingAfter || risk.overallRiskRatingBefore || '',
      risk.riskResponse || '',
       risk.mitigation || '',
      risk.contingency || '',
      risk.responsibleUser || '',
      risk.plannedActionDate || '',
      risk.closedDate || '',
      ...postAssessments,
      risk.residualRisk || '',
      '',
      risk.percentageRedution || '',
      risk.riskStatus || '',
      risk.remarks || '',

    ];
  }

  private getAssessmentDetails(assessments: RiskAssessment[], basis: any, isMitigated: boolean) {
    const assessment = assessments.find(
      a => a.assessmentBasis === basis && a.isMitigated === isMitigated
    );
    return {
      impact: assessment?.matrixImpact || '',
      likelihood: assessment?.matrixLikelihood || '',
      riskfactor: assessment?.riskFactor || ''
    };
  }

  private formatDate(dateString: string | null): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  }

  private async loadTemplate(): Promise<ExcelJS.Workbook> {
    try {
      console.log('Attempting to load template from:', this.TEMPLATE_PATH);

      const arrayBuffer = await firstValueFrom(
        this.http.get(this.TEMPLATE_PATH, { responseType: 'arraybuffer' })
      );

      console.log('Template loaded, size:', arrayBuffer.byteLength, 'bytes');

      if (arrayBuffer.byteLength === 0) {
        throw new Error('Template file is empty');
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      console.log('Template parsed successfully');
      console.log('Available worksheets:', workbook.worksheets.map(ws => ws.name));

      return workbook;

    } catch (error) {
      console.error('Error loading template:', error);
      throw new Error(
        `Failed to load Excel template from "${this.TEMPLATE_PATH}". ` +
        `Please ensure:\n` +
        `1. The file exists in the correct location\n` +
        `2. The file is a valid .xlsx file\n` +
        `3. The path is correct (use /assets/ for Angular projects)\n` +
        `Error: ${error}`
      );
    }
  }

  private populateRow(sheet: ExcelJS.Worksheet, rowIndex: number, data: any[]): void {
    // Get the existing row instead of adding a new one
    const row = sheet.getRow(rowIndex);

    // Populate each cell in the row
    data.forEach((value, index) => {
      const cell = row.getCell(index + 1); // ExcelJS uses 1-based indexing
      cell.value = value;

      // Apply cell styling
      cell.font = this.styles.cell.font;
      cell.alignment = this.styles.cell.alignment;
      cell.border = this.styles.cell.border;
    });

    row.commit();
  }
}
