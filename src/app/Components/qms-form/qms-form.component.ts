import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { FormInputComponent } from '../form-input/form-input.component';
import { FormDropdownComponent } from '../form-dropdown/form-dropdown.component';
import { FormTextAreaComponent } from '../form-text-area/form-text-area.component';
import { FormDateFieldComponent } from '../form-date-field/form-date-field.component';
import { FormDataNotInListComponent } from '../form-data-not-in-list/form-data-not-in-list.component';
import { ApiService } from '../../Services/api.service';
import { FormSuccessfullComponent } from '../form-successfull/form-successfull.component';
import { FormReferenceHeatmapPopupComponent } from '../form-reference-heatmap-popup/form-reference-heatmap-popup.component';
import { FormConformPopupComponent } from '../form-conform-popup/form-conform-popup.component';
import { Router } from '@angular/router';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { FormLoaderComponent } from '../form-loader/form-loader.component';
import { FormCategoryTableComponent } from '../form-category-table/form-category-table.component';
import { FormLikelihoodImpactTooltipComponent } from '../form-likelihood-impact-tooltip/form-likelihood-impact-tooltip.component';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../Services/auth/auth.service';
@Component({
  selector: 'app-qms-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormInputComponent,
    FormDropdownComponent,
    FormTextAreaComponent,
    FormDateFieldComponent,
    FormDataNotInListComponent,
    FormSuccessfullComponent,
    FormReferenceHeatmapPopupComponent,
    FormConformPopupComponent,
    StyleButtonComponent,
    FormLoaderComponent,
    FormCategoryTableComponent,
    FormLikelihoodImpactTooltipComponent,
  ],
  templateUrl: './qms-form.component.html',
  styleUrl: './qms-form.component.scss',
})
export class QMSFormComponent {
  qmsDraft: any = {};
  @Input() qmsDraftId: string = '';
  @Output() submitForm = new EventEmitter<any>();
  @Output() departmentSelectedByAdmin = new EventEmitter<any>();
  @Input() riskTypeValue: number = 1;
  @Input() departmentName: string = '';
  @Input() departmentId: string = '';
  @Input() departmentCode: string = '';
  @Input() dropdownLikelihood: any[] = [];
  @Input() isAdmin: string = '';
  @Input() dropdownImpact: any[] = [];
  @Input() dropdownProject: any[] = [];
  @Input() dropdownDepartment: any[] = [];
  @Input() dropdownAssignee: any[] = [];
  @Input() dropdownReviewer: Array<{
    id: number;
    fullName: string;
    email: string;
    type: string;
  }> = [];
  @Input() dropdownDataProjectForAdmin: any[] = [];
  @Input() dropdownAssigneeForAdmin: any[] = [];
  overallRiskRating: number = 0;
  reviewerNotInList: boolean = false;
  assigneeNotInList: boolean = false;
  likelihoodValue: number = 0;
  impactValue: number = 0;
  riskFactor: number = 0;
  riskId: string = '';
  likelihoodId: number = 0;
  impactId: number = 0;
  projectId: number = 0;
  departmentIdForAdminToAdd: number = 0;
  responsiblePersonId: number = 0;
  internalReviewerIdFromDropdown: number = 0;
  externalReviewerIdFromDropdown: number = 0;
  externalReviewerIdFromInput: number = 0;
  newAssigneeId: number = 0;
  isInternal: boolean = true;
  HeatMapRefernce: boolean = false;
  isSuccessReviewer: boolean = false;
  isErrorReviewer: boolean = false;
  isSuccessAssignee: boolean = false;
  isErrorAssignee: boolean = false;
  openDropdownId: string | undefined;
  isLoading = false;

  draft: any = {};
  preSelectedLikelihood: any;
  preSelectedImpact: any;
  preSelectedReviewer: any;
  preSelectedResponsiblePerson: any;
  preSelectedProject: any;
  isdraft: boolean = false;
  isdraftConform: boolean = false;
  isNothingInDraft: boolean = false;
  isCancel: boolean = false;
  isSave: boolean = false;
  isValid: boolean = false;
  newReviewername: string = '';
  newAssigneename: string = '';
  isnewAssigneenameDisplay: boolean = false;
  isnewReviewernameDisplay: boolean = false;
  isDraftLoaded = false;
  departmentIdForAdminToAddToString: string = '';
  departmentIdForAdminToAddToNumber: number = 0;
  showModalCategory = false;
  riskDisplayId: string = '';
  draftNameToFind: string = '';
  draftErrorDisplay: string = '';
  isdraftErrorDisplay: boolean = false;
  isDraftidPresent: boolean = true;
  dropdownDataProject: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private api: ApiService,
    private router: Router,
    public authService: AuthService
  ) {}
  ngOnInit() {
    if (this.qmsDraftId.length > 0) {
      this.isDraftidPresent = false;
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;
      }, 5000);

      this.loadDraft();
    } else {
      this.isDraftidPresent = true;
    }
  }

  generateRiskDisplayId() {
    this.riskDisplayId = 'RSK-' + this.departmentCode + '-***';
  }
  generateRiskDisplayIdByProject() {
    const ProjectDataForDisplay = this.dropdownProject.find(
      (factor: any) => factor.id == this.projectId
    );
    const ProjectCode = ProjectDataForDisplay.projectCode;

    this.riskDisplayId = 'RSK-' + ProjectCode + '-***';
  }

  generateRiskDisplayIdByProjectForAdmin() {
    const ProjectDataForDisplay = this.dropdownDataProjectForAdmin.find(
      (factor: any) => factor.id == this.projectId
    );
    const ProjectCode = ProjectDataForDisplay.projectCode;

    this.riskDisplayId = 'RSK-' + ProjectCode + '-***';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.qmsDraftId.length > 0) {
      if (!this.isDraftLoaded || !this.qmsDraft) {
        console.warn(
          'Draft data is not yet loaded. Skipping ngOnChanges logic.'
        );

        this.api.getSingleDraftById(this.qmsDraftId).subscribe((res: any) => {
          this.qmsDraft = res;
          if (this.isAdmin == 'Admin') {
            this.departmentId = this.qmsDraft.departmentId;
            const departmentNameDetails = this.dropdownDepartment.find(
              (factor) => factor.id === this.departmentId
            );
            this.departmentName = departmentNameDetails.departmentName;

            this.api
              .getProjects(this.departmentName)
              .pipe(
                catchError((error) => {
                  console.error('Error fetching Projects:', error);
                  return of([]);
                })
              )
              .subscribe((res: any) => {
                this.dropdownDataProjectForAdmin = res;
              });
            this.api
              .getUsersByDepartmentId(Number(this.departmentId))
              .pipe(
                catchError((error) => {
                  console.error('Error fetching Users by Department:', error);
                  return of([]);
                })
              )
              .subscribe((res: any) => {
                this.dropdownAssigneeForAdmin = res;
              });
          }

          if (changes['dropdownLikelihood']) {
            if (this.qmsDraft?.riskAssessments?.length > 0) {
              this.preSelectedLikelihood =
                this.qmsDraft.riskAssessments[0].likelihood ?? null;
            } else {
              this.preSelectedLikelihood = null;
              console.warn('No risk assessments available.');
            }
          }

          if (changes['dropdownImpact']) {
            this.preSelectedImpact = this.qmsDraft.riskAssessments[0].impact;
          }

          if (changes['dropdownProject']) {
            if (
              this.qmsDraft.projectId !== null &&
              this.qmsDraft.projectId !== undefined
            ) {
              this.preSelectedProject = this.qmsDraft.projectId;
            }
          }

          if (changes['dropdownAssignee']) {
            this.preSelectedResponsiblePerson = this.qmsDraft.responsibleUserId;
          }

          if (changes['dropdownReviewer']) {
            const selectedFactor = this.dropdownReviewer.find(
              (factor) =>
                factor.id === this.qmsDraft.riskAssessments[0].review.userId
            );

            if (selectedFactor) {
              if (selectedFactor.type === 'Internal') {
                this.isInternal = true;
                this.internalReviewerIdFromDropdown = selectedFactor.id;
                this.preSelectedReviewer = selectedFactor?.fullName;
              } else if (selectedFactor.type === 'External') {
                this.isInternal = false;
                this.externalReviewerIdFromDropdown = selectedFactor.id;
                this.preSelectedReviewer = selectedFactor?.fullName;
              }
            }
          }
        });
      }
      if (changes['qmsDraftId'] && changes['qmsDraftId'].currentValue) {
        this.loadDraft();
      }

      if (changes['departmentCode'] && this.departmentCode) {
        this.generateRiskDisplayId();
      }

      if (changes['dropdownLikelihood']) {
        this.preSelectedLikelihood =
          this.qmsDraft.riskAssessments[0].likelihood;
      }

      if (changes['dropdownImpact']) {
        this.preSelectedImpact = this.qmsDraft.riskAssessments[0].impact;
      }

      if (changes['dropdownProject']) {
        if (
          this.qmsDraft.projectId !== null &&
          this.qmsDraft.projectId !== undefined
        ) {
          this.preSelectedProject = this.qmsDraft.projectId;
        }
      }

      if (changes['dropdownAssignee']) {
        this.preSelectedResponsiblePerson = this.qmsDraft.responsibleUserId;
      }

      if (changes['dropdownReviewer']) {
        const selectedFactor = this.dropdownReviewer.find(
          (factor) =>
            factor.id === this.qmsDraft.riskAssessments[0].review.userId
        );

        if (selectedFactor) {
          if (selectedFactor.type === 'Internal') {
            this.isInternal = true;
            this.internalReviewerIdFromDropdown = selectedFactor.id;
            this.preSelectedReviewer = selectedFactor?.fullName;
          } else if (selectedFactor.type === 'External') {
            this.isInternal = false;
            this.externalReviewerIdFromDropdown = selectedFactor.id;
            this.preSelectedReviewer = selectedFactor?.fullName;
          }
        }
      }
    }

    if (changes['departmentCode'] && this.departmentCode) {
      this.generateRiskDisplayId();
    }
  }

  qmsForm = new FormGroup({
    riskName: new FormControl('', Validators.required),
    description: new FormControl('', [
      Validators.maxLength(1000),
      Validators.minLength(15),
      Validators.required,
    ]),
    impact: new FormControl('', [
      Validators.maxLength(1000),
      Validators.minLength(15),
      Validators.required,
    ]),
    mitigation: new FormControl('', [
      Validators.maxLength(1000),
      Validators.minLength(15),
      Validators.required,
    ]),
    contingency: new FormControl(''),
    plannedActionDate: new FormControl('', Validators.required),
  });

  isDisabled(): boolean {
    return this.qmsForm.invalid;
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const minHeight = 40;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
  }

  handleDropdownOpen(dropdownId: string | undefined): void {
    this.openDropdownId = dropdownId;
  }

  isReviewerNotInList() {
    this.reviewerNotInList = !this.reviewerNotInList;
  }

  isAssigneeNotInList() {
    this.assigneeNotInList = !this.assigneeNotInList;
  }
  isHeatMapReference() {
    this.HeatMapRefernce = !this.HeatMapRefernce;
  }

  onDropdownChangeProject(event: any): void {
    const selectedFactorId = Number(event);
    this.projectId = selectedFactorId;
    if (this.isAdmin != 'Admin') {
      this.generateRiskDisplayIdByProject();
    }
    if (this.isAdmin == 'Admin') {
      this.generateRiskDisplayIdByProjectForAdmin();
    }
  }

  onDropdownChangeDepartment(event: any): void {
    const selectedFactorId = Number(event);
    this.departmentIdForAdminToAdd = selectedFactorId;
    this.departmentSelectedByAdmin.emit(this.departmentIdForAdminToAdd);
    this.departmentIdForAdminToAddToNumber = this.departmentIdForAdminToAdd;
    this.departmentIdForAdminToAddToString =
      this.departmentIdForAdminToAddToNumber.toString();

    const departmentDataForDisplay = this.dropdownDepartment.find(
      (factor: any) => factor.id == this.departmentIdForAdminToAdd
    );
    const departmentCode = departmentDataForDisplay.departmentCode;

    this.riskDisplayId = 'RSK-' + departmentCode + '-***';
  }

  onDropdownChangelikelihood(event: any): void {
    const selectedFactorId = Number(event);
    this.likelihoodId = selectedFactorId;

    const selectedFactor = this.dropdownLikelihood.find(
      (factor) => Number(factor.id) === selectedFactorId
    );
    if (selectedFactor) {
      this.likelihoodValue = selectedFactor.likelihood;
    } else {
    }
    this.calculateOverallRiskRating();
  }

  onDropdownChangeImpact(event: any): void {
    const selectedFactorId = Number(event);
    this.impactId = selectedFactorId;
    const selectedFactor = this.dropdownImpact.find(
      (factor) => Number(factor.id) === selectedFactorId
    );
    if (selectedFactor) {
      this.impactValue = selectedFactor.impact;
    } else {
    }
    this.calculateOverallRiskRating();
  }

  onDropdownChangeResponsiblePerson(event: any): void {
    const selectedFactorId = Number(event);
    this.responsiblePersonId = selectedFactorId;
  }

  onDropdownChangeReviewer(selectedReviewer: any) {
    const selectedreviewer = selectedReviewer;

    const selectedFactor = this.dropdownReviewer.find(
      (factor) => factor.fullName === selectedreviewer
    );
    if (selectedFactor) {
      if (selectedFactor.type === 'Internal') {
        this.isInternal = true;
        this.internalReviewerIdFromDropdown = selectedFactor.id;
      } else if (selectedFactor.type === 'External') {
        this.isInternal = false;
        this.externalReviewerIdFromDropdown = selectedFactor.id;
      }
    } else {
      console.error('No matching reviewer found for the selected ID.');
    }
  }

  calculateOverallRiskRating() {
    if (this.likelihoodValue != 0 && this.impactValue != 0) {
      this.overallRiskRating = this.likelihoodValue * this.impactValue;
    }
    this.riskFactor = this.overallRiskRating;
  }

  changeColorOverallRiskRating() {
    if (this.overallRiskRating < 8) {
      return '#6DA34D';
    }
    if (this.overallRiskRating > 10 && this.overallRiskRating < 32) {
      return '#FFC107';
    } else {
      return '#D9534F';
    }
  }

  async onSubmit() {
    this.isLoading = true;
    if (this.isAdmin == 'Admin') {
      if (this.projectId && this.projectId != 0) {
        await this.getRiskId(null, this.projectId);
      } else {
        if (this.preSelectedProject && this.preSelectedProject != 0) {
          await this.getRiskId(null, this.preSelectedProject);
        } else {
          await this.getRiskId(Number(this.departmentIdForAdminToAdd));
        }
      }
    }

    if (this.isAdmin !== 'Admin') {
      if (this.projectId && this.projectId != 0) {
        await this.getRiskId(null, this.projectId);
      } else {
        if (this.preSelectedProject && this.preSelectedProject != 0) {
          await this.getRiskId(null, this.preSelectedProject);
        } else {
          await this.getRiskId(Number(this.departmentId));
        }
      }
    }

    if (!this.riskId) {
      console.error('Failed to fetch Risk ID. Submission aborted.');
      return;
    }

    if (this.qmsForm.invalid) {
      this.qmsForm.markAllAsTouched();
      this.isValid = true;
      this.isLoading = false;
      return;
    }

    if (
      Number(this.riskTypeValue) <= 0 ||
      Number(this.overallRiskRating) <= 0 ||
      (Number(this.responsiblePersonId) <= 0 &&
        Number(this.preSelectedResponsiblePerson) <= 0 &&
        Number(this.newAssigneeId) <= 0) ||
      (Number(this.departmentId) <= 0 &&
        Number(this.departmentIdForAdminToAdd) <= 0) ||
      (Number(this.likelihoodId) <= 0 &&
        Number(this.preSelectedLikelihood) <= 0) ||
      (Number(this.impactId) <= 0 && Number(this.preSelectedImpact) <= 0) ||
      (this.isInternal &&
        Number(this.internalReviewerIdFromDropdown) <= 0 &&
        Number(this.externalReviewerIdFromInput) <= 0 &&
        Number(this.externalReviewerIdFromDropdown) <= 0)
    ) {
      this.isValid = true;
      this.isLoading = false;
      return;
    }

    const formValue = this.qmsForm.value;
    const payload = {
      riskId: this.riskId,
      riskName: formValue.riskName,
      description: formValue.description,
      riskType: Number(this.riskTypeValue),
      impact: formValue.impact,
      mitigation: formValue.mitigation,
      contingency: formValue.contingency || ' ',
      OverallRiskRatingBefore: Number(this.overallRiskRating),
      responsibleUserId:
        Number(this.newAssigneeId) !== 0 && !isNaN(Number(this.newAssigneeId))
          ? Number(this.newAssigneeId)
          : Number(this.responsiblePersonId) !== 0 &&
            !isNaN(Number(this.responsiblePersonId))
          ? Number(this.responsiblePersonId)
          : this.preSelectedResponsiblePerson !== 0 &&
            !isNaN(Number(this.preSelectedResponsiblePerson))
          ? Number(this.preSelectedResponsiblePerson)
          : null,
      plannedActionDate: `${formValue.plannedActionDate}T00:00:00.000Z`,
      departmentId:
        Number(this.departmentIdForAdminToAdd) &&
        !isNaN(Number(this.departmentIdForAdminToAdd))
          ? Number(this.departmentIdForAdminToAdd)
          : Number(this.departmentId) !== 0 && !isNaN(Number(this.departmentId))
          ? Number(this.departmentId)
          : null,
      projectId:
        this.preSelectedProject &&
        !isNaN(Number(this.preSelectedProject)) &&
        Number(this.preSelectedProject) !== 0
          ? Number(this.preSelectedProject)
          : this.projectId &&
            !isNaN(Number(this.projectId)) &&
            Number(this.projectId) !== 0
          ? Number(this.projectId)
          : null,

      riskAssessments: [
        {
          likelihood: this.likelihoodId
            ? Number(this.likelihoodId)
            : this.preSelectedLikelihood &&
              !isNaN(Number(this.preSelectedLikelihood))
            ? Number(this.preSelectedLikelihood)
            : null,
          impact: this.impactValue
            ? Number(this.impactId)
            : this.preSelectedImpact && !isNaN(Number(this.preSelectedImpact))
            ? Number(this.preSelectedImpact)
            : null,
          isMitigated: false,
          assessmentBasisId: null,
          riskFactor: Number(this.riskFactor),
          review: {
            userId:
              Number(this.externalReviewerIdFromInput) &&
              !isNaN(Number(this.externalReviewerIdFromInput))
                ? null
                : this.isInternal &&
                  Number(this.internalReviewerIdFromDropdown) !== 0
                ? Number(this.internalReviewerIdFromDropdown)
                : null,
            externalReviewerId: Number(this.externalReviewerIdFromInput)
              ? Number(this.externalReviewerIdFromInput)
              : !this.isInternal &&
                Number(this.externalReviewerIdFromDropdown) !== 0
              ? Number(this.externalReviewerIdFromDropdown)
              : null,
            comments: ' ',
            reviewStatus: 1,
          },
        },
      ],
    };

    this.submitForm.emit(payload);
    if (this.qmsDraftId) {
      this.api.deleteDraft(this.qmsDraftId).subscribe((res: any) => {});
    }

    this.isLoading = false;
  }

  private getRiskId(
    departmentId: number | null = null,
    projectId: number | null = null
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.getNewRiskId(departmentId, projectId).subscribe({
        next: (res: any) => {
          if (res && res.riskId) {
            this.riskId = res.riskId;
            resolve();
          } else {
            console.error('Risk ID is not available in the response:', res);
            this.riskId = '';
            reject('Invalid Risk ID');
          }
        },
        error: (err) => {
          console.error('Error occurred while fetching Risk ID:', err);
          this.riskId = '';
          reject(err);
        },
      });
    });
  }

  receiveCancel(value: any) {
    if (value == true) {
      this.isAssigneeNotInList();
    }
    if (value == false) {
      this.isReviewerNotInList();
    }
  }
  saveAssignee(value: any) {
    this.isLoading = true;
    let departmentName;
    if (value.departmentId) {
      const departmentNameDetails = this.dropdownDepartment.find(
        (factor) => factor.id === value.departmentId
      );
      departmentName = departmentNameDetails.departmentName;
    }

    const payload = {
      email: value.email,
      fullName: value.fullName,
      departmentName: departmentName,
    };
    this.api.addResponsiblePerson(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res) {
          this.newAssigneeId = res.id;
          this.isSuccessAssignee = true;
          this.newAssigneename = payload.fullName;
          this.isnewAssigneenameDisplay = true;
        } else {
          console.error(
            'External Responsible ID is not available in the response:',
            res
          );
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(
          'Error occurred while fetching Responsible person ID:',
          err
        );
        this.isErrorAssignee = true;
      },
    });
  }

  saveReviewer(value: any) {
    this.isLoading = true;

    const payload = {
      email: value.email,
      fullName: value.fullName,
      departmentId: value.departmentId,
    };

    this.api.addExternalReviewer(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res) {
          this.externalReviewerIdFromInput = res.reviewerId;
          this.isSuccessReviewer = true;
          this.newReviewername = payload.fullName;
          this.isnewReviewernameDisplay = true;
        } else {
          console.error(
            'External Reviewer ID is not available in the response:',
            res
          );
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error occurred while fetching Reviewer ID:', err);
        this.isErrorReviewer = true;
      },
    });
  }

  closeHeatMap() {
    this.HeatMapRefernce = false;
  }

  closeReviewer() {
    this.isSuccessReviewer = false;
    this.isErrorReviewer = false;
  }
  closeAssignee() {
    this.isSuccessAssignee = false;
    this.isErrorAssignee = false;
  }

  async closeDraft() {
    this.isLoading = true;
    this.saveAsDraft();

    const formValue = this.qmsForm.value;
    if (formValue.riskName) {
      const payload = {
        riskId: this.riskId || null,
        riskName: formValue.riskName,
        description: formValue.description || null,
        riskType: Number(this.riskTypeValue),
        impact: formValue.impact || null,
        mitigation: formValue.mitigation || null,
        contingency: formValue.contingency || null,
        OverallRiskRatingBefore: Number(this.overallRiskRating) || null,
        responsibleUserId:
          Number(this.newAssigneeId) !== 0 && !isNaN(Number(this.newAssigneeId))
            ? Number(this.newAssigneeId)
            : Number(this.responsiblePersonId) !== 0 &&
              !isNaN(Number(this.responsiblePersonId))
            ? Number(this.responsiblePersonId)
            : this.preSelectedResponsiblePerson !== 0 &&
              !isNaN(Number(this.preSelectedResponsiblePerson))
            ? Number(this.preSelectedResponsiblePerson)
            : null,
        plannedActionDate: formValue.plannedActionDate
          ? `${formValue.plannedActionDate}T00:00:00.000Z`
          : null,

        departmentId:
          Number(this.departmentIdForAdminToAdd) &&
          !isNaN(Number(this.departmentIdForAdminToAdd))
            ? Number(this.departmentIdForAdminToAdd)
            : Number(this.departmentId) !== 0 &&
              !isNaN(Number(this.departmentId))
            ? Number(this.departmentId)
            : null,
        projectId:
          this.projectId &&
          !isNaN(Number(this.projectId)) &&
          Number(this.projectId) !== 0
            ? Number(this.projectId)
            : this.preSelectedProject &&
              !isNaN(Number(this.preSelectedProject)) &&
              Number(this.preSelectedProject) !== 0
            ? Number(this.preSelectedProject)
            : null,
        createdBy: this.authService.getCurrentUserId(),

        riskAssessments: [
          {
            likelihood: this.likelihoodId
              ? Number(this.likelihoodId)
              : this.preSelectedLikelihood &&
                !isNaN(Number(this.preSelectedLikelihood))
              ? Number(this.preSelectedLikelihood)
              : null,
            impact: this.impactValue
              ? Number(this.impactId)
              : this.preSelectedImpact && !isNaN(Number(this.preSelectedImpact))
              ? Number(this.preSelectedImpact)
              : null,
            isMitigated: false,
            assessmentBasisId: null,
            riskFactor: Number(this.riskFactor) || null,
            review: {
              userId:
                Number(this.externalReviewerIdFromInput) &&
                !isNaN(Number(this.externalReviewerIdFromInput))
                  ? null
                  : this.isInternal &&
                    Number(this.internalReviewerIdFromDropdown) !== 0
                  ? Number(this.internalReviewerIdFromDropdown)
                  : null,
              externalReviewerId: Number(this.externalReviewerIdFromInput)
                ? Number(this.externalReviewerIdFromInput)
                : !this.isInternal &&
                  Number(this.externalReviewerIdFromDropdown) !== 0
                ? Number(this.externalReviewerIdFromDropdown)
                : null,
              comments: ' ',
              reviewStatus: 1,
            },
          },
        ],
      };

      if (this.isDraftidPresent) {
        this.api.setDraftQuality(payload).subscribe({
          next: (res: any) => {
            this.isdraftConform = true;
            this.isLoading = false;

          },

          error: (error: HttpErrorResponse) => {
            this.draftErrorDisplay = error.message;
            this.isdraftErrorDisplay = true;
            this.isLoading = false;

          },
        });
      } else {
        this.api.updateDraft(this.qmsDraftId, payload).subscribe({
          next: (res: any) => {
            this.isdraftConform = true;
            this.isLoading = false;


          },

          error: (error: HttpErrorResponse) => {
            this.draftErrorDisplay = error.message;
            this.isdraftErrorDisplay = true;
            this.isLoading = false;


          },
        });
      }
    } else {
      this.isNothingInDraft = true;
      this.isLoading = false;


    }
  }

  loadDraft() {
    this.api.getSingleDraftById(this.qmsDraftId).subscribe((res: any) => {
      this.qmsDraft = res;

      this.qmsForm.patchValue({
        riskName: this.qmsDraft.riskName ?? null,
        description: this.qmsDraft.description ?? null,
        mitigation: this.qmsDraft.mitigation ?? null,
        contingency: this.qmsDraft.contingency ?? null,
        plannedActionDate: this.qmsDraft.plannedActionDate
          ? this.qmsDraft.plannedActionDate.split('T')[0]
          : null,
        impact: this.qmsDraft.impact ?? null,
      });

      this.overallRiskRating = this.qmsDraft.overallRiskRatingBefore;
      this.riskFactor = this.qmsDraft.riskAssessments[0].riskFactor;
      this.isDraftLoaded = true;
      const changes: SimpleChanges = {
        dropdownLikelihood: {
          currentValue: this.qmsDraft.riskAssessments?.[0]?.likelihood ?? null,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
        dropdownImpact: {
          currentValue: this.qmsDraft.riskAssessments?.[0]?.impact ?? null,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
        dropdownProject: {
          currentValue:
            this.qmsDraft.projectId !== null &&
            this.qmsDraft.projectId !== undefined
              ? this.qmsDraft.projectId
              : this.preSelectedProject,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
        dropdownAssignee: {
          currentValue: this.qmsDraft.responsibleUserId ?? null,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
        dropdownReviewer: {
          currentValue:
            this.qmsDraft.riskAssessments?.[0]?.review?.userId ?? null,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
      };

      this.ngOnChanges(changes);
    });
  }

  closeDraftWhenNoDraft() {
    this.isNothingInDraft = !this.isNothingInDraft;
  }

  closeDraftWhenErrorOccur() {
    this.isdraftErrorDisplay = !this.isdraftErrorDisplay;
  }

  saveAsDraft() {
    this.isdraft = !this.isdraft;
  }
  saveConfirmation() {
    this.isSave = !this.isSave;
  }
  saveRisk() {
    this.onSubmit();
    this.isSave = false;
  }

  closeDialogSuccess() {
    this.router.navigate(['/home']);
  }

  cancelRisk() {
    this.isCancel = !this.isCancel;
  }
  closeRisk() {
    this.router.navigate(['/home']);
  }
  closepopupIsValidCheck() {
    this.isValid = false;
  }

  conform: string =
    'Do you want to save the entered risk details? <br> You can check and edit them later if needed.';

  toggleModalCategory() {
    this.showModalCategory = !this.showModalCategory;
  }

  closeModalCategory() {
    this.showModalCategory = false;
  }

  showModal = false;
  tableType = '';
  handleInfoClickLikelihood(event: boolean) {
    this.showModal = true;
    this.tableType = 'likelihood';
  }
  handleInfoClickImpact(event: boolean) {
    this.showModal = true;
    this.tableType = 'impact';
  }
  hideModal() {
    this.showModal = false;
  }
}
