import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { OperationRoomService } from '../services/operationroom.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-operationroom',
  templateUrl: './operationroom.component.html',
  standalone: false,
  styleUrl: '../app.component.css',
})
export class OperationroomComponent implements OnInit {
  operationRoomForm: FormGroup;
  editedOperationRoom: any;
  modalTitle: string;
  operationRooms: Observable<any>;


  constructor(private operationRoomService: OperationRoomService) {}



  ngOnInit() {
    this.operationRooms = this.operationRoomService.data$;
    this.reloadOperationRooms();
    this.operationRoomForm = new FormGroup<any>({
      roomNr: new FormControl(null, [Validators.required]),
      buildingBlock: new FormControl(null, [Validators.required]),
      floor: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
    });
  }

  reloadOperationRooms() {
    this.operationRoomService.refreshData();
  }

  openModal(operationRoom: any) {
    this.editedOperationRoom = operationRoom;

    let roomNr = '';
    let buildingBlock = '';
    let floor = '';
    let type = '';
    let state = '';

    this.modalTitle = 'create';

    if (operationRoom) {
      roomNr = operationRoom.roomNr;
      buildingBlock = operationRoom.buildingBlock;
      floor = operationRoom.floor;
      type = operationRoom.type;
      state = operationRoom.state;
      this.modalTitle = 'edit';
    }
    this.operationRoomForm.patchValue({
      roomNr: roomNr,
      buildingBlock: buildingBlock,
      floor: floor,
      type: type,
      state: state,
    });
  }

  onSubmit() {
    let bodyObj = {
      roomNr: this.operationRoomForm.value.roomNr,
      buildingBlock: this.operationRoomForm.value.buildingBlock,
      floor: this.operationRoomForm.value.floor,
      type: this.operationRoomForm.value.type,
      state: this.operationRoomForm.value.state,
    };

    if (this.editedOperationRoom) {
      this.operationRoomService
        .putOperationRoom(this.editedOperationRoom.id, bodyObj)
        .subscribe({
          next: this.handlePutResponse.bind(this),
          error: this.handleError.bind(this),
        });
    } else {
      this.operationRoomService.postOperationRoom(bodyObj).subscribe({
        next: this.handlePostResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }

    setTimeout(() => {
      this.reloadOperationRooms();
    }, 500);
  }

  onDeleteOperationRoom(id: string) {
    this.operationRoomService.deleteOperationRoom(id).subscribe({
      next: this.handleDeleteResponse.bind(this),
      error: this.handleError.bind(this),
    });
    setTimeout(() => {
      this.reloadOperationRooms();
    }, 500);
  }

  handlePostResponse() {}
  handlePutResponse() {}
  handleDeleteResponse() {}
  handleError() {}
}
