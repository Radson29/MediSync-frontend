import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AssessmentService } from '../services/assessment.service';
import { PreOpAssessmentService } from '../services/preopassessment.service';
import { TeamMemberService } from '../services/teammember.service';
import { PatientService } from '../services/patient.service';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  standalone: false,
  styleUrl: '../app.component.css',
})
export class AssessmentComponent implements OnInit {
  assessmentForm: FormGroup;
  editedAssessment: any;
  modalTitle: string;

  assessments: Observable<any>;
  teamMembers: Observable<any>;
  assets: Observable<any>;
  patients: Observable<any>;
  preOperativeAssessment: Observable<any>;

  combined: Observable<[any[], any[], any[]]>;

  constructor(
    private assessmentService: AssessmentService,
    private teamMemberService: TeamMemberService,
    private patientService: PatientService,
    private preOperativeAssessmentService: PreOpAssessmentService
  ) {}

  ngOnInit() {
    this.assessments = this.assessmentService.data$;
    this.teamMembers = this.teamMemberService.data$;
    this.patients = this.patientService.data$;
    this.preOperativeAssessment = this.preOperativeAssessmentService.data$;

    this.reloadAssessments();
    this.reloadPreOperativeAssessment();
    this.reloadPatient();
    this.reloadTeamMember();

    this.assessmentForm = new FormGroup<any>({
      teamMember: new FormControl(null, [Validators.required]),
      patient: new FormControl(null, [Validators.required]),
      preOperativeAssessments: new FormControl(null, [Validators.required]),
      startdate: new FormControl(null, [Validators.required]),
    });

    this.combined = combineLatest([
      this.preOperativeAssessment,
      this.teamMembers,
      this.patients,
    ]);
  }

  reloadAssessments() {
    this.assessmentService.refreshData();
  }

  reloadPreOperativeAssessment() {
    this.preOperativeAssessmentService.refreshData();
  }

  reloadPatient() {
    this.patientService.refreshData();
  }

  reloadTeamMember() {
    this.teamMemberService.refreshData();
  }

  openModal(assessment: any) {
    this.editedAssessment = assessment;

    let startDate = '';
    let teamMemberId = '';
    let patientId = '';
    let preOpAssessmentId = '';

    this.modalTitle = 'create';

    if (assessment) {
      const localDate = new Date(assessment.startDate);
      startDate = localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"

      teamMemberId = assessment.teamMember.id;
      patientId = assessment.patient.id;
      preOpAssessmentId = assessment.preOperativeAssessment.name;

      this.modalTitle = 'edit';
    }

    this.assessmentForm.patchValue({
      teamMember: teamMemberId,
      patient: patientId,
      preOperativeAssessments: preOpAssessmentId,
      startdate: startDate,
    });
  }

  onSubmit() {
    const rawDate = this.assessmentForm.value.startdate;
const date = new Date(rawDate);

// Format na: 'YYYY-MM-DD HH:mm:ss.SSS'
const formattedDate = date.toISOString().slice(0, 19); // daje '2025-04-01T11:29:00'
    let bodyObj = {
      teamMemberId: this.assessmentForm.value.teamMember,
      preOpAssessmentId: this.assessmentForm.value.preOperativeAssessments,
      patientId: this.assessmentForm.value.patient,
      startDate: formattedDate,
    };

    if (this.editedAssessment) {
      this.assessmentService
        .putAssessment(
          this.editedAssessment.teamMember.id,
          this.editedAssessment.patient.id,
          this.editedAssessment.preOperativeAssessment.name,
          bodyObj
        )
        .subscribe({
          next: this.handlePutResponse.bind(this),
          error: this.handleError.bind(this),
        });
    } else {
      this.assessmentService.postAssessment(bodyObj).subscribe({
        next: this.handlePostResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }

    setTimeout(() => {
      this.reloadAssessments();
    }, 500);
  }

  onDeleteAssessment(
    teamMemberId: string,
    patientId: string,
    preOpAId: string
  ) {
    this.assessmentService
      .deleteAssessment(teamMemberId, patientId, preOpAId)
      .subscribe({
        next: this.handleDeleteResponse.bind(this),
        error: this.handleError.bind(this),
      });
    setTimeout(() => {
      this.reloadAssessments();
    }, 500);
  }

  handlePostResponse() {}
  handlePutResponse() {}
  handleDeleteResponse() {}
  handleError() {}
}
