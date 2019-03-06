import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-character',
  templateUrl: './delete-character.component.html',
  styleUrls: ['./delete-character.component.css']
})
export class DeleteCharacterComponent implements OnInit {

  @Input() char: any;
  imgPaths = {
    "Paladin": "../../../../assets/paladin.png",
    "Mage": "../../../../assets/mage.png",
    "Healer": "../../../../assets/healer.png",
    "Orc": "../../../../assets/orc.png"
  };
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
