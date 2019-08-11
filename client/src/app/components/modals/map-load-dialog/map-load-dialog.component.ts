import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AssetService } from '../../../services/asset.service';

@Component({
  selector: 'app-map-load-dialog',
  templateUrl: './map-load-dialog.component.html',
  styleUrls: ['./map-load-dialog.component.css']
})
export class MapLoadDialogComponent implements OnInit {

  public mapList: Array<string> = [];
  public selected: string = 'Upload a custom map';

  constructor(
    private activeModal: NgbActiveModal,
    private _assetService: AssetService
  ) { }

  ngOnInit() {
    this._assetService.getMapList().subscribe(res => {
      this.mapList = (<any>res).maps;
    }, err => {
      console.log('error retrieving map list', err);
    });
  }
}
