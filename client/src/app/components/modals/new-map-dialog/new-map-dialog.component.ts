import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'app-new-map-dialog',
  templateUrl: './new-map-dialog.component.html',
  styleUrls: ['./new-map-dialog.component.css']
})
export class NewMapDialogComponent implements OnInit {

  properties = {
    title: "untitledmap",
    xSize: 64,
    ySize: 64
  }
  errors = [];
  private propertiesSchema = {
    'title': { 'required': true, 'type': 'string', 'minLength': 4 },
    'xSize': { 'required': true, 'type': 'number', 'min': 1, 'max': 256 },
    'ySize': { 'required': true, 'type': 'number', 'min': 1, 'max': 256 },
  }
  constructor(
    private activeModal: NgbActiveModal,
    private _validatorService: ValidationService
  ) { }

  ngOnInit() {
  }

  hasError(key: string) {
    let error = false;
    this.errors.forEach(err => { if (err.key === key) error = true });
    return error;
  }

  validate() {
    this.errors = this._validatorService.validate(this.properties, this.propertiesSchema);
  }

  formIsClear() {
    return !(this.properties.title || this.properties.xSize || this.properties.ySize);
  }
}
