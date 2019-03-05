import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateCharacterComponent } from '../modals/create-character/create-character.component';
import { DeleteCharacterComponent } from '../modals/delete-character/delete-character.component';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-room-join',
  templateUrl: './room-join.component.html',
  styleUrls: ['./room-join.component.css']
})
export class RoomJoinComponent implements OnInit {

  //characters = [];
  characters = [
    { name: "Frojo", class: "Paladin", level: 5, _id: "abc12345" },
    { name: "Zartan", class: "Mage", level: 13, _id: "oioioio" },
    { name: "Aezraele", class: "Healer", level: 1, _id: "asdfklasjdfk" },
    { name: "Thunk", class: "Orc", level: 4, _id: "qweruio" },
  ];

  imgPaths = {
    "Paladin": "../../../assets/paladin.png",
    "Mage": "../../../assets/mage.png",
    "Healer": "../../../assets/healer.png",
    "Orc": "../../../assets/orc.png"
  };
  selectedCharId = '';
  roomCode = '';

  constructor(
    private _modalService: NgbModal,
    private _characterService: CharacterService
  ) { }

  ngOnInit() {
    this._characterService.getCharacters().subscribe(res => {
      this.characters = res['characters'];
    }, err => {
      console.log(err);
    });
  }

  isSelected(char) {
    return char['_id'] === this.selectedCharId;
  }

  selectChar(char) {
    this.selectedCharId = char['_id'];
  }

  createChar() {
    let createCharModal = this._modalService.open(CreateCharacterComponent);
    createCharModal.result.then(val => {

    });
  }

  deleteChar(char) {
    let deleteCharModal = this._modalService.open(DeleteCharacterComponent);
    deleteCharModal.componentInstance.char = char;
    deleteCharModal.result.then(val => {
      console.log(val);
    }).catch(err => {console.log(err)});
  }

  canJoin() {
    return this.selectedCharId == '' || this.roomCode.length != 5;
  }

  join() {
    if (this.canJoin()) {
      
    }
  }

}
