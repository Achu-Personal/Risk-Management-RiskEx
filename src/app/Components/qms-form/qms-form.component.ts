import { department } from './../../Interfaces/deparments.interface';
import {
  ChangeDetectorRef,
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
import { FormRiskResponseComponent } from '../form-risk-response/form-risk-response.component';
import { FormResponseTableComponent } from "../form-response-table/form-response-table.component";
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
    FormRiskResponseComponent,
    FormResponseTableComponent
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
  @Input() riskResponses: Array<{
    id: number;
    name: string;
    description: string;
    example: string;
    risks: string;
  }> = [];
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
  showModalCategory = false; // Initially hidden
  riskDisplayId: string = '';
  draftNameToFind: string = '';
  draftErrorDisplay: string = '';
  isdraftErrorDisplay: boolean = false;
  isDraftidPresent: boolean = true;
  dropdownDataProject: any;
  riskResponseValue: number = 0;
  showResponseModel = false
  preselectedResponseName: string = '';



  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private api: ApiService,
    private router: Router,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    // console.log('department code is', this.departmentCode);

    if (this.qmsDraftId.length > 0) {
      this.isDraftidPresent = false;
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;
      }, 5000); // 5000 milliseconds = 5 seconds

      // console.log('qmsDraftId received, loading draft...');
      this.loadDraft();
    } else {
      this.isDraftidPresent = true;
    }
  }

  handleInfoClickResponse(event: boolean) {
    this.showResponseModel = true

  }
  hideModalResponse() {
    this.showResponseModel = false;
  }

  onRadioSelectionChange(value: any) {
    this.riskResponseValue = value;
    // console.log('Selected value from child:', value);
  }
  generateRiskDisplayId() {
    this.riskDisplayId = 'RSK-' + this.departmentCode + '-***';
    // console.log('id id id id id id ', this.riskDisplayId);
  }
  generateRiskDisplayIdByProject() {
    const ProjectDataForDisplay = this.dropdownProject.find(
      (factor: any) => factor.id == this.projectId
    );
    // console.log('data simple data data simple data', ProjectDataForDisplay);
    const ProjectCode = ProjectDataForDisplay.projectCode;
    // console.log('code code code', ProjectCode);

    this.riskDisplayId = 'RSK-' + ProjectCode + '-***';
    // console.log('id id id id id id ', this.riskDisplayId);
  }

  generateRiskDisplayIdByProjectForAdmin() {
    const ProjectDataForDisplay = this.dropdownDataProjectForAdmin.find(
      (factor: any) => factor.id == this.projectId
    );
    // console.log('data simple data data simple data', ProjectDataForDisplay);
    const ProjectCode = ProjectDataForDisplay.projectCode;
    // console.log('code code code', ProjectCode);

    this.riskDisplayId = 'RSK-' + ProjectCode + '-***';
    // console.log('id id id id id id ', this.riskDisplayId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.qmsDraftId.length > 0) {
      if (!this.isDraftLoaded || !this.qmsDraft || !this.qmsDraft.riskAssessments || this.qmsDraft.riskAssessments.length === 0) {
        console.warn(
          'Draft data is not yet loaded. Skipping ngOnChanges logic.'
        );

        this.api.getSingleDraftById(this.qmsDraftId).subscribe((res: any) => {
          this.qmsDraft = res;

          // Add safety check here too
          if (!this.qmsDraft.riskAssessments || this.qmsDraft.riskAssessments.length === 0) {
            console.warn('Draft loaded but riskAssessments is empty or undefined');
            return;
          }

          if (this.isAdmin == 'Admin') {
            this.departmentId = this.qmsDraft.departmentId;
            const departmentNameDetails = this.dropdownDepartment.find(
              (factor) => factor.id === this.departmentId
            );
            if (departmentNameDetails) {
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

                  // After dropdown is populated, set the project selection
                  if (this.qmsDraft.projectId && this.qmsDraft.projectId !== 0) {
                    this.projectId = this.qmsDraft.projectId;
                    this.preSelectedProject = this.qmsDraft.projectId;
                    this.generateRiskDisplayIdByProjectForAdmin();
                  }
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
          }

          if (this.qmsDraft?.riskResponseId && Array.isArray(this.riskResponses) && this.riskResponses.length > 0) {
            const match = this.riskResponses.find(r =>
              Number(r.id) === Number(this.qmsDraft.riskResponseId)
            );
            this.preselectedResponseName = match ? match.name : '';
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
            if (this.qmsDraft?.riskAssessments?.length > 0) {
              this.preSelectedImpact = this.qmsDraft.riskAssessments[0].impact;
            }
          }

          if (changes['dropdownProject']) {
            if (
              this.qmsDraft.projectId !== null &&
              this.qmsDraft.projectId !== undefined
            ) {
              this.projectId = this.qmsDraft.projectId;
              this.preSelectedProject = this.qmsDraft.projectId;
            } else {
              this.projectId = 0;
              this.preSelectedProject = null;
            }
          }

          if (changes['dropdownAssignee']) {
            this.preSelectedResponsiblePerson = this.qmsDraft.responsibleUserId;
          }

          if (changes['dropdownReviewer']) {
            if (this.qmsDraft?.riskAssessments?.length > 0) {
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
        });
        return; // Important: exit early if data is not loaded
      }

      if (changes['qmsDraftId'] && changes['qmsDraftId'].currentValue) {
        this.loadDraft();
      }

      if (changes['departmentCode'] && this.departmentCode) {
        this.generateRiskDisplayId();
      }

      // Add safety checks for all riskAssessments access
      if (changes['dropdownLikelihood'] && this.qmsDraft?.riskAssessments?.length > 0) {
        this.preSelectedLikelihood = this.qmsDraft.riskAssessments[0].likelihood;
      }

      if (changes['dropdownImpact'] && this.qmsDraft?.riskAssessments?.length > 0) {
        this.preSelectedImpact = this.qmsDraft.riskAssessments[0].impact;
      }

      if (changes['dropdownProject']) {
        if (
          this.qmsDraft.projectId !== null &&
          this.qmsDraft.projectId !== undefined
        ) {
          this.projectId = this.qmsDraft.projectId;
          this.preSelectedProject = this.qmsDraft.projectId;
        } else {
          this.projectId = 0;
          this.preSelectedProject = null;
        }
      }

      if (changes['dropdownAssignee']) {
        this.preSelectedResponsiblePerson = this.qmsDraft.responsibleUserId;
      }

      if (changes['dropdownReviewer'] && this.qmsDraft?.riskAssessments?.length > 0) {
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
    ISOClause: new FormControl('')
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
    const selectedFactorId = event === null ? null : Number(event);

    // If cleared (null), reset to department-based ID
    if (selectedFactorId === null) {
      this.projectId = 0;
      this.preSelectedProject = null;

      // Revert to department-based risk ID
      if (this.isAdmin !== 'Admin') {
        this.generateRiskDisplayId();
      } else {
        // For admin, generate based on selected department
        if (this.departmentIdForAdminToAdd) {
          const departmentDataForDisplay = this.dropdownDepartment.find(
            (factor: any) => factor.id == this.departmentIdForAdminToAdd
          );
          if (departmentDataForDisplay) {
            const departmentCode = departmentDataForDisplay.departmentCode;
            this.riskDisplayId = 'RSK-' + departmentCode + '-***';
          }
        }
      }
      return;
    }

    // Project selected - generate project-based ID
    this.projectId = selectedFactorId;
    if (this.isAdmin !== 'Admin') {
      this.generateRiskDisplayIdByProject();
    }
    if (this.isAdmin === 'Admin') {
      this.generateRiskDisplayIdByProjectForAdmin();
    }
  }

  onDropdownChangeDepartment(event: any): void {
    const selectedFactorId = Number(event);
    this.departmentIdForAdminToAdd = selectedFactorId;
    this.departmentSelectedByAdmin.emit(this.departmentIdForAdminToAdd);
    // console.log('dfghjkldfghjkdcfvghj', this.departmentIdForAdminToAdd);
    this.departmentIdForAdminToAddToNumber = this.departmentIdForAdminToAdd;
    this.departmentIdForAdminToAddToString =
      this.departmentIdForAdminToAddToNumber.toString();
    // console.log('the project id isssssssssssssssssssssss', this.projectId);

    const departmentDataForDisplay = this.dropdownDepartment.find(
      (factor: any) => factor.id == this.departmentIdForAdminToAdd
    );
    // console.log('data simple data data simple data', departmentDataForDisplay);
    const departmentCode = departmentDataForDisplay.departmentCode;
    // console.log('code code code', departmentCode);

    this.riskDisplayId = 'RSK-' + departmentCode + '-***';
    // console.log('id id id id id id ', this.riskDisplayId);

    // this.loadDraftForAdmin();
  }

  // loadDraftForAdmin() {
  //   console.log('the project id isssssssssssssssssssssss', this.projectId);
  //   this.qmsForm.reset();
  //   this.overallRiskRating = 0;
  //   this.riskFactor = 0;
  //   this.preSelectedProject = null;
  //   this.preSelectedLikelihood = 0;
  //   this.preSelectedImpact = 0;
  //   this.preSelectedResponsiblePerson = null;
  //   this.preSelectedReviewer = null;

  //   const draftKey = `draft_${this.departmentIdForAdminToAdd}`;
  //   const draft = localStorage.getItem(draftKey);
  //   if (draft) {
  //     this.draft = JSON.parse(draft);
  //     console.log('Draft Loaded:', this.draft);
  //     this.qmsForm.patchValue(this.draft.formValues);
  //     this.overallRiskRating = this.draft.OverallRiskRatingBefore;
  //     this.riskFactor = this.draft.riskAssessments[0].riskFactor;
  //     console.log(
  //       'likelihooooooooooooooood',
  //       this.draft.riskAssessments[0].likelihood
  //     );
  //     this.isDraftLoaded = true;

  //     const changes: SimpleChanges = {
  //       dropdownLikelihood: {
  //         currentValue: this.draft.riskAssessments?.[0]?.likelihood ?? null,
  //         previousValue: undefined,
  //         firstChange: true,
  //         isFirstChange: () => true,
  //       },
  //       dropdownImpact: {
  //         currentValue: this.draft.riskAssessments?.[0]?.impact ?? null,
  //         previousValue: undefined,
  //         firstChange: true,
  //         isFirstChange: () => true,
  //       },
  //       dropdownProject: {
  //         currentValue:
  //           this.draft.projectId !== null && this.draft.projectId !== undefined
  //             ? this.draft.projectId
  //             : this.preSelectedProject, // Keeps the previous value if null
  //         previousValue: null,
  //         firstChange: true,
  //         isFirstChange: () => true,
  //       },
  //       dropdownAssignee: {
  //         currentValue: this.draft.responsibleUserId ?? null,
  //         previousValue: undefined,
  //         firstChange: true,
  //         isFirstChange: () => true,
  //       },
  //       dropdownReviewer: {
  //         currentValue: this.draft.riskAssessments?.[0]?.review?.userId ?? null,
  //         previousValue: undefined,
  //         firstChange: true,
  //         isFirstChange: () => true,
  //       },
  //     };

  //     this.ngOnChanges(changes);
  //     console.log('the project id isssssssssssssssssssssss', this.projectId);
  //   }
  //   console.log(
  //     'the project id isssssssssssssssssssssss after draft',
  //     this.projectId
  //   );
  // }

  onDropdownChangelikelihood(event: any): void {
    const selectedFactorId = Number(event);
    console.log(selectedFactorId);
    this.likelihoodId = selectedFactorId;

    const selectedFactor = this.dropdownLikelihood.find(
      (factor) => Number(factor.id) === selectedFactorId
    );
    if (selectedFactor) {
      this.likelihoodValue = selectedFactor.likelihood;
      // console.log('Selected Likelihood:', this.likelihoodValue);
    } else {
      console.log('Selected factor not found.');
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
      // console.log('Selected Impact:', this.impactValue);
    } else {
      console.log('Selected factor not found.');
    }
    this.calculateOverallRiskRating();
  }

  onDropdownChangeResponsiblePerson(event: any): void {
    const selectedFactorId = Number(event);
    this.responsiblePersonId = selectedFactorId;
  }

  onDropdownChangeReviewer(selectedReviewer: any) {
    const selectedreviewer = selectedReviewer;
    // console.log('selected factor id is ', selectedreviewer);

    const selectedFactor = this.dropdownReviewer.find(
      (factor) => factor.fullName === selectedreviewer
    );
    // console.log('selected factor is ', selectedFactor);
    if (selectedFactor) {
      if (selectedFactor.type === 'Internal') {
        this.isInternal = true;
        this.internalReviewerIdFromDropdown = selectedFactor.id;
        // console.log(
        //   'Selected internal reviewer ID:',
        //   this.internalReviewerIdFromDropdown
        // );

        // console.log('this is a internal reviewer', this.isInternal);
      } else if (selectedFactor.type === 'External') {
        this.isInternal = false;
        this.externalReviewerIdFromDropdown = selectedFactor.id;
        // console.log(
        //   'Selected external reviewer ID:',
        //   this.externalReviewerIdFromDropdown
        // );
        // console.log('this is a internal reviewer', this.isInternal);
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
    if (this.overallRiskRating <= 4) {
      return '#6DA34D';
    }
    if (this.overallRiskRating >= 6 && this.overallRiskRating <= 16) {
      return '#FFC107';
    } else {
      return '#D9534F';
    }
  }

  async onSubmit() {
    this.isLoading = true;
    // Determine final projectId (null if cleared/not selected)
    const finalProjectId = this.projectId && this.projectId !== 0
      ? this.projectId
      : this.preSelectedProject && this.preSelectedProject !== 0
        ? this.preSelectedProject
        : null;

    if (this.isAdmin === 'Admin') {
      if (finalProjectId) {
        await this.getRiskId(null, finalProjectId);
      } else {
        await this.getRiskId(Number(this.departmentIdForAdminToAdd));
      }
    }

    if (this.isAdmin !== 'Admin') {
      if (finalProjectId) {
        await this.getRiskId(null, finalProjectId);
      } else {
        await this.getRiskId(Number(this.departmentId));
      }
    }

    if (!this.riskId) {
      console.error('Failed to fetch Risk ID. Submission aborted.');
      return;
    }

    // console.log(this.qmsForm.value);

    if (this.qmsForm.invalid) {
      console.log('Form is invalid, submission blocked');
      this.qmsForm.markAllAsTouched();
      this.isValid = true;
      this.isLoading = false;
      return;
    }

    if (
      Number(this.riskTypeValue) <= 0 || Number(this.riskResponseValue) <= 0 ||
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
      console.log('Invalid numeric fields: Numbers must be greater than 0');
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
      contingency: formValue.contingency || null,
      OverallRiskRatingBefore: Number(this.overallRiskRating),
      riskResponseId: this.riskResponseValue,
      ISOClauseNumber: formValue.ISOClause || null,
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
      projectId: finalProjectId,

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

    console.log("payload from qms ", payload);

    this.submitForm.emit(payload);
    if (this.qmsDraftId) {
      this.api.deleteDraft(this.qmsDraftId).subscribe((res: any) => {
        // console.log(res);
        console.log('Draft Removed!');
      });
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
            // console.log('Risk ID received in function:', this.riskId);
            resolve();
          } else {
            console.error('Risk ID is not available in the response:', res);
            this.riskId = ''; // Reset riskId if invalid
            reject('Invalid Risk ID');
          }
        },
        error: (err) => {
          console.error('Error occurred while fetching Risk ID:', err);
          this.riskId = ''; // Reset riskId if an error occurs
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
    this.isLoading = true; // Show loader when function starts
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
        this.isLoading = false; // Hide loader after success
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
        this.isLoading = false; // Hide loader on error
        console.error(
          'Error occurred while fetching Responsible person ID:',
          err
        ); // Log the full error to see what went wrong
        this.isErrorAssignee = true;
      },
    });

    // console.log(
    //   'the project id isssssssssssssssssssssss after assignee add api',
    //   this.projectId
    // );
  }

  saveReviewer(value: any) {
    this.isLoading = true; // Show loader when function starts
    // console.log(
    //   'the project id isssssssssssssssssssssss before reviewer add api',
    //   this.projectId
    // );

    const payload = {
      email: value.email,
      fullName: value.fullName,
      departmentId: value.departmentId,
    };

    this.api.addExternalReviewer(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false; // Hide loader after success

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
        this.isLoading = false; // Hide loader on error
        console.error('Error occurred while fetching Reviewer ID:', err);
        this.isErrorReviewer = true;
      },
    });

    // console.log(
    //   'the project id isssssssssssssssssssssss after reviewer add api',
    //   this.projectId
    // );
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

      // Determine final projectId
      const finalProjectId = this.projectId &&
        !isNaN(Number(this.projectId)) &&
        Number(this.projectId) !== 0
        ? Number(this.projectId)
        : this.preSelectedProject &&
          !isNaN(Number(this.preSelectedProject)) &&
          Number(this.preSelectedProject) !== 0
          ? Number(this.preSelectedProject)
          : null;

      const payload = {
        riskId: this.riskId || null,
        riskName: formValue.riskName,
        description: formValue.description || null,
        riskType: Number(this.riskTypeValue),
        impact: formValue.impact || null,
        mitigation: formValue.mitigation || null,
        contingency: formValue.contingency || null,
        ISOClauseNumber: formValue.ISOClause || null,
        riskResponseId: this.riskResponseValue,
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
        projectId: finalProjectId,
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
                  ? null // If externalReviewerId is present, userId should be null
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
            // this.saveAsDraft();
          },

          error: (error: HttpErrorResponse) => {
            this.draftErrorDisplay = error.message;
            this.isdraftErrorDisplay = true;
            this.isLoading = false;
            // this.saveAsDraft();
          },
        });
      } else {
        this.api.updateDraft(this.qmsDraftId, payload).subscribe({
          next: (res: any) => {
            this.isdraftConform = true;
            this.isLoading = false;

            // this.saveAsDraft();
          },

          error: (error: HttpErrorResponse) => {
            this.draftErrorDisplay = error.message;
            this.isdraftErrorDisplay = true;
            this.isLoading = false;

            // this.saveAsDraft();
          },
        });
      }
    } else {
      this.isLoading = false;
      this.isNothingInDraft = true;


      // this.saveAsDraft();
    }
  }

  loadDraft() {
    this.api.getSingleDraftById(this.qmsDraftId).subscribe((res: any) => {
      this.qmsDraft = res;
      console.log('Draft loaded:', this.qmsDraft);

      this.qmsForm.patchValue({
        riskName: this.qmsDraft.riskName ?? null,
        description: this.qmsDraft.description ?? null,
        mitigation: this.qmsDraft.mitigation ?? null,
        contingency: this.qmsDraft.contingency ?? null,
        plannedActionDate: this.qmsDraft.plannedActionDate
          ? this.qmsDraft.plannedActionDate.split('T')[0]
          : null,
        impact: this.qmsDraft.impact ?? null,
        ISOClause: this.qmsDraft.isoClauseNumber ?? null,
      });

      // Set risk response
      const match = this.riskResponses.find(r =>
        Number(r.id) === Number(this.qmsDraft.riskResponseId)
      );
      this.preselectedResponseName = match ? match.name : '';
      this.riskResponseValue = this.qmsDraft.riskResponseId || 0;

      // Set department and risk calculations
      this.departmentIdForAdminToAdd = this.qmsDraft.departmentId;
      this.overallRiskRating = this.qmsDraft.overallRiskRatingBefore;
      this.riskFactor = this.qmsDraft.riskAssessments[0].riskFactor;

      // Set likelihood and impact
      this.preSelectedLikelihood = this.qmsDraft.riskAssessments?.[0]?.likelihood ?? null;
      this.preSelectedImpact = this.qmsDraft.riskAssessments?.[0]?.impact ?? null;
      this.likelihoodId = this.preSelectedLikelihood;
      this.impactId = this.preSelectedImpact;

      // Set responsible person
      this.preSelectedResponsiblePerson = this.qmsDraft.responsibleUserId;
      this.responsiblePersonId = this.qmsDraft.responsibleUserId || 0;

      // Set reviewer
      const selectedFactor = this.dropdownReviewer.find(
        (factor) =>
          factor.id === this.qmsDraft.riskAssessments[0].review.userId ||
          factor.id === this.qmsDraft.riskAssessments[0].review.externalReviewerId
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

      // Set projectId if it exists in draft
      if (this.qmsDraft.projectId && this.qmsDraft.projectId !== 0) {
        this.projectId = this.qmsDraft.projectId;
        this.preSelectedProject = this.qmsDraft.projectId;

        console.log('Setting project from draft:', this.projectId);

        // Generate project-based Risk ID
        if (this.isAdmin === 'Admin') {
          // Wait for dropdownDataProjectForAdmin to be populated
          setTimeout(() => {
            if (this.dropdownDataProjectForAdmin && this.dropdownDataProjectForAdmin.length > 0) {
              console.log('Generating risk ID for admin with project');
              this.generateRiskDisplayIdByProjectForAdmin();
              this.cdr.detectChanges();
            }
          }, 200);
        } else {
          // Wait for dropdownProject to be populated
          setTimeout(() => {
            if (this.dropdownProject && this.dropdownProject.length > 0) {
              console.log('Generating risk ID for user with project');
              this.generateRiskDisplayIdByProject();
              this.cdr.detectChanges();
            }
          }, 200);
        }
      } else {
        // No project selected - generate department-based Risk ID
        this.projectId = 0;
        this.preSelectedProject = null;

        if (this.isAdmin === 'Admin' && this.departmentIdForAdminToAdd) {
          const departmentDataForDisplay = this.dropdownDepartment.find(
            (factor: any) => factor.id == this.departmentIdForAdminToAdd
          );
          if (departmentDataForDisplay) {
            const departmentCode = departmentDataForDisplay.departmentCode;
            this.riskDisplayId = 'RSK-' + departmentCode + '-***';
          }
        } else {
          this.generateRiskDisplayId();
        }
      }

      this.isDraftLoaded = true;
      this.cdr.detectChanges();

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
              : null,
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
    this.showModalCategory = !this.showModalCategory; // Toggle modal visibility
  }

  closeModalCategory() {
    this.showModalCategory = false; // Ensure modal closes only on the close button
  }

  showModal = false;
  tableType = '';
  handleInfoClickLikelihood(event: boolean) {
    // console.log('Info button clicked, boolean value:', event);
    this.showModal = true;
    this.tableType = 'likelihood';
    // Do something when button is clicked
  }
  handleInfoClickImpact(event: boolean) {
    // console.log('Info button clicked, boolean value:', event);
    this.showModal = true;
    this.tableType = 'impact';
    // Do something when button is clicked
  }
  hideModal() {
    this.showModal = false;
  }
}
