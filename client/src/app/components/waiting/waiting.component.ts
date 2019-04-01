import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent implements OnInit {

  leader = false;
  mySocketService;

  constructor(
    private _socketService: SocketService,
    private _toastrService: ToastrService,
    private _router: Router,
    private _userService: UserService
  ) { }

  ngOnInit() {
    this.mySocketService = this._socketService.onMessage().subscribe(msg => {
      //this._toastrService.info(JSON.stringify(msg));
      if (msg.hasOwnProperty('from') && msg.hasOwnProperty('msg')) {
        if (msg.msg.hasOwnProperty('success') && msg.msg.hasOwnProperty('message')) {
          if (msg.msg.hasOwnProperty('tv_soc')) {
            this._toastrService.success(msg.msg.message, 'Success!');
            this._userService.tv_soc = msg.msg.tv_soc;
            if (msg.msg.hasOwnProperty('leader')) {
              this.leader = true;
            }
          } else {
            this._toastrService.error(msg.msg.message, 'Error!');
            this.mySocketService.unsubscribe();
            //this._socketService.disconnect();
            this._router.navigate(['/join']);
          }
        }
      }
    });
  }

}
