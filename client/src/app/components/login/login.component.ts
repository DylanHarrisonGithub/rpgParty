import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgForm, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  msg;

  constructor(private _userService: UserService) { }

  ngOnInit() {
  }

  onSubmit(loginForm: NgForm) {
    let u = {
      username: loginForm.value.name,
      password: loginForm.value.password
    }
    console.log(u);
    this._userService.login(u).subscribe(res => {
      this.msg = res;
      setTimeout(() => { this.msg = null; }, 5000);
    }, (err) => {
      this.msg = err.error;
      setTimeout(() => { this.msg = null; }, 5000);
    });
  }
}
