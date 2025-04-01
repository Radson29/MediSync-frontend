import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperationService } from '../services/operation.service';
import { TeamMemberService } from '../services/teammember.service';
import { PatientService } from '../services/patient.service';
import { OperationRoomService } from '../services/operationroom.service';
import { OperationTypeService } from '../services/operationtype.service';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  standalone: false,
  styleUrl: '../app.component.css',
})
export class OperationComponent implements OnInit {
  operationForm: FormGroup;
  editedOperation: any;
  modalTitle: string;
  operations: Observable<any>;
  operationTypes: Observable<any>;
  operationRooms: Observable<any>;
  patients: Observable<any>;
  teamMembers: Observable<any>;

  constructor(
    private operationService: OperationService,
    private operationTypeService: OperationTypeService,
    private operationRoomService: OperationRoomService,
    private patientService: PatientService,
    private teamMemberService: TeamMemberService
  ) {}


  combined$: Observable<[any[], any[], any[], any[]]>;

  ngOnInit() {

    this.operations = this.operationService.data$;
    this.operationTypes = this.operationTypeService.data$;
    this.operationRooms = this.operationRoomService.data$;
    this.patients = this.patientService.data$;
    this.teamMembers = this.teamMemberService.data$;
    this.reloadOperations();
    this.operationTypeService.refreshData();
    this.operationRoomService.refreshData();
    this.patientService.refreshData();
    this.teamMemberService.refreshData();

    //init form
    this.operationForm = new FormGroup<any>({
      operationType: new FormControl(null, [Validators.required]),
      operationRoom: new FormControl(null, [Validators.required]),
      patient: new FormControl(null, [Validators.required]),
      teamMembers: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
    });

    this.combined$ = combineLatest([this.operationTypes, this.operationRooms, this.patients, this.teamMembers]);
  }

  reloadOperations() {
    this.operationService.refreshData();
  }

  openModal(operation: any) {
    this.editedOperation = operation;

    let operationType = '';
    let operationRoom = '';
    let patient = '';
    let teamMembers = '';
    let state = '';
    let startDate = '';

    if (operation) {
      this.modalTitle = 'edit';

      operationType = operation.operationType.name;
      operationRoom = operation.operationRoom.id;
      patient = operation.patient.id;
      teamMembers = operation.teamMembers.map((obj: any) => obj.id);
      state = operation.state;
       // Konwersja daty do formatu YYYY-MM-DDTHH:mm
    const date = new Date(operation.startDate);
    const localISO = date.toISOString().slice(0, 16); // bez sekund i "Z"
    startDate = localISO;
    }

    this.operationForm.patchValue({
      operationType: operationType,
      operationRoom: operationRoom,
      patient: patient,
      teamMembers: teamMembers,
      state: state,
      startDate: startDate,
    });
  }

  onSubmit() {
    let operationType;
    this.operationTypes.subscribe(data => {
      let id:any = this.operationForm.value.operationType;
      operationType = data.find((obj: { name: number; }) => String(id) === String(obj.name))
    })

    let operationRoom;
    this.operationRooms.subscribe(data => {
      let id:any = this.operationForm.value.operationRoom;
      operationRoom = data.find((obj: { id: number; }) => String(id) === String(obj.id))
    })

    let patient;
    this.patients.subscribe(data => {
      let id:any = this.operationForm.value.patient;
      patient = data.find((obj: { id: number; }) => String(id) === String(obj.id))
    })

    let teamMembers;
    this.teamMembers.subscribe(data => {
      let ids:any[] = this.operationForm.value.teamMembers;
      teamMembers = data.filter((obj: { id: any; }) => ids.includes(obj.id))
    })

    let bodyObj = {
      operationType: operationType,
      operationRoom: operationRoom,
      patient: patient,
      teamMembers: teamMembers,
      state: this.operationForm.value.state,
      startDate: this.operationForm.value.startDate
    };

    if (this.editedOperation) {
      this.operationService.putOperation(this.editedOperation.id, bodyObj).subscribe({
        next: () => {
          this.handlePutResponse();
          this.reloadOperations(); // <-- tu
        },
        error: this.handleError.bind(this)
      });
    } else {
      this.operationService.postOperation(bodyObj).subscribe({
        next: (res) => {
          this.handlePostResponse(res);
          this.reloadOperations(); // <-- i tu
        },
        error: this.handleError.bind(this)
      });
    }

    setTimeout(() => {
      this.reloadOperations();
    }, 500);
  }

  onDeleteOperation(id:string) {

    this.operationService.deleteOperation(id).subscribe({
      next: this.handleDeleteResponse.bind(this),
      error: error => this.handleError.bind(error)
    })

    setTimeout(() => {
      this.reloadOperations();
    }, 500);
  }

  handlePostResponse(obj:any) {
    console.log(obj)
  }
  handlePutResponse(){}
  handleDeleteResponse(){}
  handleError() {
  }
}
