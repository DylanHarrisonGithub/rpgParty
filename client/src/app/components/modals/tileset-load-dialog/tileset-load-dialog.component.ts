import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tileset-load-dialog',
  templateUrl: './tileset-load-dialog.component.html',
  styleUrls: ['./tileset-load-dialog.component.css']
})
export class TilesetLoadDialogComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
