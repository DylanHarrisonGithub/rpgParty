import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _router: Router,
    private _toastrService: ToastrService
  ) { }

  ngOnInit() {
  }

  onSubmit(loginForm: NgForm) {
    let u = {
      username: loginForm.value.name,
      password: loginForm.value.password
    }
    this._userService.login(u).subscribe(res => {
      if (res.hasOwnProperty('success') && res.hasOwnProperty('message')) {
        if (res['success']) {
          this._toastrService.success(res['message'], 'Success!');          
          this._authService.saveToken(res['token']);
          //this._toastrService.info(null, JSON.stringify(this._authService.getUserDetails()),{timeOut: 0, extendedTimeOut: 0});
          this._router.navigate(['/home']);
        } else {
          this._toastrService.error(res['message'], 'Login Error!');
        }
      } else {
        this._toastrService.error('Unhandled login error', 'Login Error!');
      }
    }, (err) => {
      this._toastrService.error('Unknown login error', 'Login Error!');
    });
  }
}
