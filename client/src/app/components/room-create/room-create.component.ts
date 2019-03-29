import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from '../../services/socket.service';
import { QuestLoadDialogComponent } from '../modals/quest-load-dialog/quest-load-dialog.component';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.css']
})
export class RoomCreateComponent implements OnInit {

  roomCode = ""
  portraitPath = "../../../assets/";
  quest;
  players = [
    //{ player: { name: "LISA", level: 19, class: "paladin" } },
    //{ player: { name: "Homer", level: 19, class: "mage" } },
    //{ player: { name: "bart", level: 19, class: "healer" } },
    //{ player: { name: "marge", level: 19, class: "orc" } },
    { player: null },
    { player: null },
    { player: null },
    { player: null },
    { player: null },
    { player: null },
    { player: null },
    { player: null },
  ];

  constructor(
    private _modalService: NgbModal,
    private _socketService: SocketService,
    private _toastrService: ToastrService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this._socketService.connect({
      initialize: true,
      token: this._authService.getToken()
    });
    this._socketService.onMessage().subscribe(msg => {
      this._toastrService.info(JSON.stringify(msg));
      if (msg.hasOwnProperty('room')) {
        this.roomCode = msg['room'];
      } else if (msg.hasOwnProperty('user') && msg.hasOwnProperty('character') && msg.hasOwnProperty('soc_id')) {
        let i = 0;
        while (this.players[i].player != null && i < this.players.length) {
          i++;
        }
        if (i < this.players.length) {
          this.players[i].player = {
            name: msg.character.name,
            class: msg.character.class.toLowerCase(),
            level: msg.character.level
          }
        }
      }
      
    });
  }

  loadQuest() {
    let questModal = this._modalService.open(QuestLoadDialogComponent);
    questModal.result.then(val => {
      this.quest = val;
    }, err => {});
  }
}
