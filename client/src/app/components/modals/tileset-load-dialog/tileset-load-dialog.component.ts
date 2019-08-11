import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AssetService } from '../../../services/asset.service';

@Component({
  selector: 'app-tileset-load-dialog',
  templateUrl: './tileset-load-dialog.component.html',
  styleUrls: ['./tileset-load-dialog.component.css']
})
export class TilesetLoadDialogComponent implements OnInit {

  public tilesetList: Array<string> = [];
  public selected: string = 'Upload a custom tile set';

  constructor(
    private activeModal: NgbActiveModal,
    private _assetService: AssetService
  ) { }

  ngOnInit() {
    this._assetService.getTilesetList().subscribe(res => {
      this.tilesetList = (<any>res).tilesets;
    }, err => {
      console.log('error retrieving tileset list', err);
    });
  }

}
