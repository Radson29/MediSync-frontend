import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamMemberService } from '../services/teammember.service';
import { OperationProviderService } from '../services/operationprovider.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-teammember',
  templateUrl: './teammember.component.html',
  standalone: false,
  styleUrl: '../app.component.css',
})
export class TeammemberComponent implements OnInit {
  teamMemberForm: FormGroup;
  editedTeamMember: any;
  modalTitle: string;
  teamMembers: Observable<any>;
  operationProviders: Observable<any>;

  constructor(
    private teamMemberService: TeamMemberService,
    private operationProviderService: OperationProviderService
  ) {}



  ngOnInit() {
    this.reloadTeamMembers();
    this.teamMembers = this.teamMemberService.data$;
    this.operationProviders = this.operationProviderService.data$;
    this.operationProviderService.refreshData();
    this.teamMemberForm = new FormGroup<any>({
      name: new FormControl(null, [Validators.required]),
      op: new FormControl(null, [Validators.required]),
    });
  }

  reloadTeamMembers() {
    this.teamMemberService.refreshData();
  }

  openModal(teamMember: any) {
    this.editedTeamMember = teamMember;

    let name = '';
    let opType;

    this.modalTitle = 'create';

    if (teamMember) {
      name = teamMember.name;
      opType = teamMember.operationProvider.type;

      this.modalTitle = 'edit';
    }
    this.teamMemberForm.patchValue({
      name: name,
      op: opType,
    });
  }

  onSubmit() {
    if (this.editedTeamMember) {
      this.teamMemberService
        .putTeamMember(this.editedTeamMember.id, {
          name: this.teamMemberForm.value.name,
          operationProvider: { type: this.teamMemberForm.value.op },
        })
        .subscribe({
          next: this.handlePutResponse.bind(this),
          error: this.handleError.bind(this),
        });
    } else {
      this.teamMemberService
        .postTeamMember({
          name: this.teamMemberForm.value.name,
          operationProvider: { type: this.teamMemberForm.value.op },
        })
        .subscribe({
          next: this.handlePostResponse.bind(this),
          error: this.handleError.bind(this),
        });
    }

    setTimeout(() => {
      this.reloadTeamMembers();
    }, 500);
  }

  onDeleteTeamMember(id: string) {
    this.teamMemberService.deleteTeamMember(id).subscribe({
      next: this.handleDeleteResponse.bind(this),
      error: this.handleError.bind(this),
    });
    setTimeout(() => {
      this.reloadTeamMembers();
    }, 500);
  }

  handlePostResponse() {}
  handlePutResponse() {}
  handleDeleteResponse() {}
  handleError() {}
}
