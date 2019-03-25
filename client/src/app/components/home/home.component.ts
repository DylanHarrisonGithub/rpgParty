import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _toastrService: ToastrService
  ) { }

  ngOnInit() {
    this._toastrService.success('Toast message', 'Toast Title');
  }

}
