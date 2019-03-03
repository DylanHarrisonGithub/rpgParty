import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  msg;

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(loginForm: NgForm) {
    let u = {
      username: loginForm.value.name,
      password: loginForm.value.password
    }
    this._userService.login(u).subscribe(res => {
      this.msg = res;
      if (res['success']) {
        this._authService.saveToken(res['token']);
      }
      setTimeout(() => { 
        if (this.msg.success) {
          this._router.navigate(['/home']);
        }
        this.msg = null;
      }, 4000);
    }, (err) => {
      this.msg = JSON.stringify(err.error);
      setTimeout(() => { this.msg = null; }, 4000);
    });
  }
}
