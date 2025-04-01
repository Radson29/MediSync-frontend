import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamMemberService } from '../services/teammember.service';
import { OperationProviderService } from '../services/operationprovider.service';
import { OperationTypeService } from '../services/operationtype.service';
import { AssetService } from '../services/asset.service';
import { PreOpAssessmentService } from '../services/preopassessment.service';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-operationtype',
  templateUrl: './operationtype.component.html',
  standalone: false,
  styleUrl: '../app.component.css',
})
export class OperationtypeComponent implements OnInit {
  operationTypeForm: FormGroup;
  editedOperationType: any;
  modalTitle: string;
  operationTypes: Observable<any>;
  operationProviders: Observable<any>;
  assets: Observable<any>;
  preOperativeAssessments: Observable<any>;
  combined$: Observable<[any[], any[], any[]]>;

  constructor(
    private operationTypeService: OperationTypeService,
    private operationProviderService: OperationProviderService,
    private assetService: AssetService,
    private preOpAssessmentService: PreOpAssessmentService
  ) {}

  ngOnInit() {
    this.reloadOperationTypes();
    this.operationTypes = this.operationTypeService.data$;
    this.operationProviders = this.operationProviderService.data$;
    this.assets = this.assetService.data$;
    this.preOperativeAssessments = this.preOpAssessmentService.data$

    //init child objects
    this.operationProviderService.refreshData();
    this.assetService.refreshData();
    this.preOpAssessmentService.refreshData();

    //init form
    this.operationTypeForm = new FormGroup<any>({
      name: new FormControl(null, [Validators.required]),
      roomType: new FormControl(null, [Validators.required]),
      durationHours: new FormControl(null, [Validators.required]),
      assets: new FormControl(null, [Validators.required]),
      operationProviders: new FormControl(null, [Validators.required]),
      preOperativeAssessments: new FormControl(null, [Validators.required]),
    });

    this.combined$ = combineLatest([this.operationProviders, this.assets, this.preOperativeAssessments]);
  }

  reloadOperationTypes() {
    this.operationTypeService.refreshData();
  }

  openModal(operationType: any) {
    this.editedOperationType = operationType;

    let name = '';
    let roomType = '';
    let assets = '';
    let durationHours = '';
    let operationProviders = '';
    let preOperativeAssessments = '';

    this.modalTitle = 'create';

    if (operationType) {
      this.modalTitle = 'edit';

      name = operationType.name;
      roomType = operationType.roomType;
      assets = operationType.assets.map((obj: any) => obj.id);
      durationHours = operationType.durationHours;
      operationProviders = operationType.operationProviders.map(
        (obj: any) => obj.type
      );
      preOperativeAssessments = operationType.preOperativeAssessments.map(
        (obj: any) => obj.name
      );
    }

    this.operationTypeForm.patchValue({
      name: name,
      roomType: roomType,
      durationHours: durationHours,
      assets: assets,
      operationProviders: operationProviders,
      preOperativeAssessments: preOperativeAssessments,
    });
  }

  onSubmit() {
    let ops;
    this.operationProviders.subscribe(data => {
      let ids:any[] = this.operationTypeForm.value.operationProviders;
      ops = data.filter((obj: { type: string; }) => ids.includes(obj.type))
    })

    let assetsHelper;
    this.assets.subscribe(data => {
      let ids:any[] = this.operationTypeForm.value.assets;
      assetsHelper = data.filter((obj: { id: number; }) => ids.includes(obj.id))
    })

    let preOpAs;
    this.preOperativeAssessments.subscribe(data => {
      let ids:any[] = this.operationTypeForm.value.preOperativeAssessments;
      preOpAs = data.filter((obj: { name: string; }) => ids.includes(obj.name))
    })

    let bodyObj = {
      name: this.operationTypeForm.value.name,
      roomType: this.operationTypeForm.value.roomType,
      durationHours: this.operationTypeForm.value.durationHours,
      assets: assetsHelper,
      operationProviders: ops,
      preOperativeAssessments: preOpAs,
    };

    console.log(bodyObj);

    if (this.editedOperationType) {
      this.operationTypeService
        .putOperationType(this.editedOperationType.name, bodyObj)
        .subscribe({
          next: this.handlePutResponse.bind(this),
          error: this.handleError.bind(this),
        });
    } else {
      this.operationTypeService.postOperationType(bodyObj).subscribe({
        next: this.handlePostResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }

    setTimeout(() => {
      this.reloadOperationTypes();
    }, 500);
  }

  onDeleteOperationType(id: string) {
    this.operationTypeService.deleteOperationType(id).subscribe({
      next: this.handleDeleteResponse.bind(this),
      error: this.handleError.bind(this),
    });

    setTimeout(() => {
      this.reloadOperationTypes();
    }, 500);
  }

  handlePostResponse() {}
  handlePutResponse() {}
  handleDeleteResponse() {}
  handleError() {}
}
