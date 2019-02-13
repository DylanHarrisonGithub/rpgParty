import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgForm, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  msg;
  usernameErrors = [];
  usernameChanged = false;
  emailErrors = [];
  emailChanged = false;
  passwordErrors = [];
  passwordChanged = false;
  emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    

  constructor(private _userService: UserService) { }

  ngOnInit() {
  }

  reset() {
    this.usernameErrors = [];
    this.usernameChanged = false;
    this.emailErrors = [];
    this.emailChanged = false;
    this.passwordErrors = [];
    this.passwordChanged = false;
  }

  onSubmit(registerForm: NgForm) {
    this._userService.postUser({
      username: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password
    }).subscribe(res => {
      this.msg = res;
      registerForm.reset();
      this.reset();
      setTimeout(() => { this.msg = null }, 5000);
    }, (err) => {
      console.log(err.error);
      this.msg = err.error;
    });
  }

  validateUsername(registerForm: NgForm) {
    this.usernameChanged = true;
    this.usernameErrors = [];
    if (registerForm.value.name.length == 0) this.usernameErrors.push('Username is required.');
    if (registerForm.value.name.length < 3) this.usernameErrors.push('Username must be at least 3 characters.');
    if (registerForm.value.name.length > 15) this.usernameErrors.push('Username cannot exceed 15 character length.');
    if (registerForm.value.name && !/^[a-zA-Z0-9]+$/.test(registerForm.value.name)) this.usernameErrors.push('Username may contain alpha-numeric characters only.');
    if (!this.usernameErrors.length) {
      this._userService.isUniqueUsername({ username: registerForm.value.name }).subscribe(res => {
        if (res.hasOwnProperty('isUniqueUsername') && res['isUniqueUsername'] === false) {
          this.usernameErrors.push('Username already exists.');
        }
      });
    }
  }

  validateEmail(registerForm: NgForm) {
    this.emailChanged = true;
    this.emailErrors = [];
    if (registerForm.value.email.length == 0) this.emailErrors.push('Email is required.');
    if (registerForm.value.email.length < 3) this.emailErrors.push('Email must be at least 3 characters.');
    if (registerForm.value.email.length > 30) this.emailErrors.push('Email cannot exceed 30 character length.');
    if (registerForm.value.email && !this.emailRegEx.test(registerForm.value.email)) this.emailErrors.push('Email is not valid.');
    if (!this.emailErrors.length) {
      this._userService.isUniqueEmail({ email: registerForm.value.email }).subscribe(res => {
        if (res.hasOwnProperty('isUniqueEmail') && res['isUniqueEmail'] === false) {
          this.emailErrors.push('Email already exists.');
        }
      });    
    }
  }

  validatePassword(registerForm: NgForm) {
    this.passwordChanged = true;
    this.passwordErrors = [];
  }

}
