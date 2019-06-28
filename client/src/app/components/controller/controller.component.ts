import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit {

  constructor(
    private _userService: UserService,
    private _socketService: SocketService
  ) { }

  ngOnInit() {
  }

  up() {
    this._socketService.toSock(this._userService.room, this._userService.tv_soc, {
      'route': 'up'
    });
  }
  down() {
    this._socketService.toSock(this._userService.room, this._userService.tv_soc, {
      'route': 'down'
    });
  }
  left() {
    this._socketService.toSock(this._userService.room, this._userService.tv_soc, {
      'route': 'left'
    });
  }
  right() {
    this._socketService.toSock(this._userService.room, this._userService.tv_soc, {
      'route': 'right'
    });
  }

}
