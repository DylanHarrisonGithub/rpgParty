import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  msg = '';
  constructor(private _userService: UserService) { }

  ngOnInit() {
  }

  onSubmit(registerForm: NgForm) {
    this._userService.postUser({
      username: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password
    }).subscribe(res => {
      this.msg = JSON.stringify(res);
      registerForm.reset();
      setTimeout(() => { this.msg = '' }, 5000);
    });
  }
}
