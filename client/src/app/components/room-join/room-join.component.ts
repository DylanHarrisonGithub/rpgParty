import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { CreateCharacterComponent } from '../modals/create-character/create-character.component';
import { DeleteCharacterComponent } from '../modals/delete-character/delete-character.component';

import { AuthService } from 'src/app/services/auth.service';
import { CharacterService } from '../../services/character.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-room-join',
  templateUrl: './room-join.component.html',
  styleUrls: ['./room-join.component.css']
})
export class RoomJoinComponent implements OnInit {

  characters = [];

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
    private _authService: AuthService,
    private _characterService: CharacterService,
    private _router: Router,
    private _socketService: SocketService,
    private _toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.getCharacters();
  }

  private getCharacters(): void {
    this._characterService.getCharacters().subscribe(res => {
      if (res.hasOwnProperty('characters')) {
        this.characters = res['characters'];
      }
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
      this._characterService.createCharacter({ name: val.name, class: val.class }).subscribe(res => {
        if (res.hasOwnProperty('success') && res.hasOwnProperty('message')) {
          if (res['success']) {
            this._toastrService.success(res['message'], 'Success!');
            this.getCharacters();
          } else {
            this._toastrService.error(res['message'], 'Character Create Error');
          }
        } else {
          this._toastrService.error('Unhandled error', 'Character Create Error');
          console.log(res);
        }
      }, err => {
        this._toastrService.error('Unknown error', 'Character Create Error');
        console.log(err);
      });
    }, err => {
      //console.log(err);
    });
  }

  deleteChar(char) {
    let deleteCharModal = this._modalService.open(DeleteCharacterComponent);
    deleteCharModal.componentInstance.char = char;
    deleteCharModal.result.then(val => {
      if (val == 'Delete') {
        this._characterService.deleteCharacter(char._id).subscribe(res => {
          if (res.hasOwnProperty('success') && res.hasOwnProperty('message')) {
            if (res['success']) {
              this._toastrService.success(res['message'], 'Success!');              
              this.getCharacters();
            } else {
              this._toastrService.error(res['message'], 'Error!'); 
            }
          } else {
            this._toastrService.error('Unhandled character deletion error.', 'Error!');
          }
        }, err => {
          this._toastrService.error('Unknown character deletion error.', 'Error!');
        });
      }
    }).catch(err => {/*console.log(err)*/});
  }

  canJoin() {
    return this.selectedCharId != '' && /[a-zA-Z]{4}/.test(this.roomCode) && this._authService.isLoggedIn();
  }

  join() {
    if (this.canJoin()) {
      let char = this.characters.find(c => c._id == this.selectedCharId);
      if (char) {
        this._socketService.connect({
          user: this._authService.getUserDetails(),
          character: char,
          room: this.roomCode.toUpperCase(),
          token: this._authService.getToken()
        });
        this._socketService.onMessage().subscribe(msg => {
          if (msg.hasOwnProperty('success') && msg.hasOwnProperty('message')) {
            if (msg['success']) {
              this._toastrService.success(msg['message'], 'Success!');
              this._router.navigate(['/waiting']);
            } else {
              this._toastrService.error(msg['message'], 'Error!');
            }
          } else {
            this._toastrService.error(JSON.stringify(msg), 'Error!',{timeOut: 0, extendedTimeOut: 0});
          }
        });
      }
    }
  }

}
