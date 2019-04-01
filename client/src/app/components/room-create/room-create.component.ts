import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from '../../services/socket.service';
import { QuestLoadDialogComponent } from '../modals/quest-load-dialog/quest-load-dialog.component';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

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
    private _authService: AuthService,
    private _userService: UserService
  ) { }

  ngOnInit() {
    this._userService.isTV = true;
    this._socketService.connect({
      initialize: true,
      token: this._authService.getToken()
    });
    this._socketService.onMessage().subscribe(msg => {
      if (msg.hasOwnProperty('room') && msg.hasOwnProperty('soc_id')) {
        this.roomCode = msg['room'];
        this._userService.soc_id = msg['soc_id'];
        this._toastrService.success('New room created: ' + msg.room);
        this._userService.room = msg['room'];
      } else if (msg.hasOwnProperty('user') && msg.hasOwnProperty('character') && msg.hasOwnProperty('soc_id')) {
        // verify character is unique in room
        if (!this.players.find(player => (player.player && player.player['_id'] == msg.character._id))) {
          let i = 0;
          while (this.players[i].player != null && i < this.players.length) {
            i++;
          }
          if (i < this.players.length) {
            this.players[i].player = {
              name: msg.character.name,
              class: msg.character.class.toLowerCase(),
              level: msg.character.level,
              _id: msg.character._id
            }
          }
          this._userService.roommates.push({
            user: msg.user,
            character: msg.character,
            soc_id: msg.soc_id
          });
          if (this._userService.roommates.length == 1) {
            setTimeout(() => {
              this._socketService.toSock(
                this._userService.room,
                msg.soc_id,
                {
                  success: true,
                  message: "Permitted to join by host.",
                  tv_soc: this._userService.soc_id,
                  leader: true
                }
              );
            }, 2000);  
          } else {
            setTimeout(() => {
              this._socketService.toSock(
                this._userService.room,
                msg.soc_id,
                {
                  success: true,
                  message: "Permitted to join by host.",
                  tv_soc: this._userService.soc_id
                }
              );
            }, 2000);  
          }       
        } else {
          this._toastrService.error('Character _id: ' + msg.character._id + ' could not join because already in room.', 'Error');
          setTimeout(() => {           
            this._socketService.toSock(
              this._userService.room,
              msg.soc_id,
              {
                success: false,
                message: 'Character _id: ' + msg.character._id + ' could not join because already in room.'
              }
            );
          }, 2000);
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
