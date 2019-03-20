import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from '../../services/socket.service';
import { QuestLoadDialogComponent } from '../modals/quest-load-dialog/quest-load-dialog.component';

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
    private _socketService: SocketService
  ) { }

  ngOnInit() {
    this._socketService.connect({initialize: true});
    this._socketService.onMessage().subscribe(msg => {
      if (msg.hasOwnProperty('room')) {
        this.roomCode = msg['room'];
      }
    });
  }

  loadQuest() {
    let questModal = this._modalService.open(QuestLoadDialogComponent);
    questModal.result.then(val => {
    }, err => {});
  }
}
