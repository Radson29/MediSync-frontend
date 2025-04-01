import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { PatientService } from '../services/patient.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  standalone: false,
  styleUrl: '../app.component.css',
})
export class PatientsComponent implements OnInit {
  patientForm: FormGroup;
  editedPatient: any;
  modalTitle: string;
  patients: Observable<any>;

  constructor(private patientService: PatientService) {}


  ngOnInit() {
    this.reloadPatients();
    this.patients = this.patientService.data$;
    this.patientForm = new FormGroup<any>({
      name: new FormControl(null, [Validators.required]),
      nin: new FormControl(null, [Validators.required]),
    });
  }

  reloadPatients() {
    this.patientService.refreshData();
  }

  openModal(patient: any) {
    this.editedPatient = patient;

    let name = '';
    let nin = '';
    this.modalTitle = 'create';

    if (patient) {
      name = patient.name;
      nin = patient.nin;
      this.modalTitle = 'edit';
    }
    this.patientForm.patchValue({
      name: name,
      nin: nin,
    });
  }

  onSubmit() {
    if (this.editedPatient) {
      this.patientService
        .putPatient(this.editedPatient.id, {
          name: this.patientForm.value.name,
          nin: this.patientForm.value.nin,
        })
        .subscribe({
          next: this.handlePutResponse.bind(this),
          error: this.handleError.bind(this),
        });
    } else {
      this.patientService
        .postPatient({
          name: this.patientForm.value.name,
          nin: this.patientForm.value.nin,
        })
        .subscribe({
          next: this.handlePostResponse.bind(this),
          error: this.handleError.bind(this),
        });
    }

    setTimeout(() => {
      this.reloadPatients();
    }, 500);
  }

  onDeletePatient(id: string) {
    this.patientService.deletePatient(id).subscribe({
      next: this.handleDeleteResponse.bind(this),
      error: this.handleError.bind(this),
    });
    setTimeout(() => {
      this.reloadPatients();
    }, 500);
  }

  handlePostResponse() {}
  handlePutResponse() {}
  handleDeleteResponse() {}
  handleError() {}
}
