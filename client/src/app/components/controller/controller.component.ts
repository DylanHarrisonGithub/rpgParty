import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

import { TouchpadComponent } from '../controller/touchpad/touchpad.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myTouchpad2') myTouchpad: TouchpadComponent;

  public touchpadConfig = {
    inactiveColor: '#d3d3d3',
    activeColor: '#ff1090',
    analog: false,
    digitalSectors: 8
  }
  touchpadData = { x: 0, y: 0 };
  touchpadDataSubscription;
  touchpadInitialized = false;
  error = "";

  constructor(
    private _userService: UserService,
    private _socketService: SocketService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.touchpadDataSubscription = this.myTouchpad.touchpadData().subscribe(tpdata => {
        if (this.touchpadInitialized) {
          this._socketService.toSock(this._userService.room, this._userService.tv_soc, {
            'route': 'touchPad',
            'data': {
              x: tpdata.mx,
              y: tpdata.my
            }
          });
        } else {
          this.touchpadInitialized = true;
        }
      });
    });
  }
  
  ngOnDestroy() {
    this.touchpadDataSubscription.unsubscribe();
  }

}
