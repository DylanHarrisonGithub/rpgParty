import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-character',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.css']
})
export class CreateCharacterComponent implements OnInit {

  constructor(
    private _activeModal: NgbActiveModal,
  ) { }

  imgPath = "../../../../assets/";

  baseStats = {
    "Paladin": {
      hit_points: 30,
      magic_points: 5,
      stats: {
        strength: 10,
        agility: 5,
        vitality: 5,
        intelligence: 5,
        luck: 1
      },
      assets: {
        portrait: "paladin.png",
        gamePiece: ""
      }
    },
    "Mage": {
      hit_points: 10,
      magic_points: 25,
      stats: {
        strength: 1,
        agility: 4,
        vitality: 4,
        intelligence: 16,
        luck: 1
      },
      assets: {
        portrait: "mage.png",
        gamePiece: ""
      }
    },
    "Healer": {
      hit_points: 20,
      magic_points: 15,
      stats: {
        strength: 1,
        agility: 4,
        vitality: 10,
        intelligence: 10,
        luck: 1
      },
      assets: {
        portrait: "healer.png",
        gamePiece: ""
      }
    },
    "Orc": {
      hit_points: 35,
      magic_points: 0,
      stats: {
        strength: 16,
        agility: 2,
        vitality: 6,
        intelligence: 1,
        luck: 1
      },
      assets: {
        portrait: "orc.png",
        gamePiece: ""
      }
    }
  };
  selectedClass= 0;
  classNames = ["Paladin", "Mage", "Healer", "Orc"];
  charName = '';
  ngOnInit() {
  }

  private nextClass() {
    this.selectedClass = (this.selectedClass + 1) % this.classNames.length;
  }

  private prevClass() {
    this.selectedClass = (this.classNames.length + this.selectedClass - 1) % this.classNames.length;
  }

  private onClose() {
    this._activeModal.close({
      class: this.classNames[this.selectedClass],
      name: this.charName
    });
  }
}
