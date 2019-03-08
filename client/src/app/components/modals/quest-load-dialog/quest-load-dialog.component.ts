import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AssetService } from '../../../services/asset.service';

@Component({
  selector: 'app-quest-load-dialog',
  templateUrl: './quest-load-dialog.component.html',
  styleUrls: ['./quest-load-dialog.component.css']
})
export class QuestLoadDialogComponent implements OnInit {

  private questList = [];
  private selected = 'Upload a custom quest';

  constructor(
    private activeModal: NgbActiveModal,
    private _assetService: AssetService
  ) { }

  ngOnInit() {
    this._assetService.getQuestList().subscribe(res => {
      this.questList = (<any>res).quests;
    }, err => {
      console.log('error retrieving quest list', err);
    });
  }

}
