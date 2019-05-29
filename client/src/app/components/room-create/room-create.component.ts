import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from '../../services/socket.service';
import { QuestLoadDialogComponent } from '../modals/quest-load-dialog/quest-load-dialog.component';
import { Router } from '@angular/router';

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

  private mySockSubstription;

  constructor(
    public _modalService: NgbModal,
    public _socketService: SocketService,
    public _toastrService: ToastrService,
    public _authService: AuthService,
    public _userService: UserService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._userService.isTV = true;
    this._socketService.connect({
      initialize: true,
      token: this._authService.getToken()
    });
    this.mySockSubstription = this._socketService.onMessage().subscribe(msg => {
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
      } else if (msg.hasOwnProperty('msg') && msg.msg.hasOwnProperty('ready')) {
        this.mySockSubstription.unsubscribe();
        this._router.navigate(['/play']);
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
