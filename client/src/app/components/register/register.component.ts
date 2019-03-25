import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameErrors = [];
  usernameChanged = false;
  emailErrors = [];
  emailChanged = false;
  passwordErrors = [];
  passwordChanged = false;
  emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _router: Router,
    private _toastrService: ToastrService
  ) { }

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
    let u = {
      username: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password
    }
    this._userService.postUser(u).subscribe(res => {
      if (res.hasOwnProperty('success') && res.hasOwnProperty('message')) {
        if (res['success']) {
          this._toastrService.success(res['message'], 'Success!');
          this._authService.saveToken(res['token']);
          this._toastrService.info(null, JSON.stringify(this._authService.getUserDetails()),{timeOut: 0, extendedTimeOut: 0});
          this._router.navigate(['/home']);
        } else {
          this._toastrService.error(res['message'], 'Registration Error');
        }
      } else {
        this._toastrService.error('Unknown Error', 'Registration Error');
      }
    }, (err) => {      
      this._toastrService.error(JSON.stringify(err), 'Registration Error');
    });
  }

  validateUsername(registerForm: NgForm) {
    this.usernameErrors = [];
    if (registerForm.value.name != null) {
      this.usernameChanged = true;
      if (registerForm.value.name.length == 0) this.usernameErrors.push('Username is required.');
      if (registerForm.value.name.length < 3) this.usernameErrors.push('Username must be at least 3 characters.');
      if (registerForm.value.name.length > 15) this.usernameErrors.push('Username cannot exceed 15 character length.');
      if (registerForm.value.name && !/^[a-zA-Z0-9]+$/.test(registerForm.value.name)) this.usernameErrors.push('Username may contain alpha-numeric characters only.');
      if (!this.usernameErrors.length && registerForm.value.name != null) {
        this._userService.isUniqueUsername({ username: registerForm.value.name }).subscribe(res => {
          if (res.hasOwnProperty('isUniqueUsername') && res['isUniqueUsername'] === false) {
            this.usernameErrors.push('Username already exists.');
          }
        });
      }
    }
  }

  validateEmail(registerForm: NgForm) {
    this.emailErrors = [];
    if (registerForm.value.email != null) {
      this.emailChanged = true;
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
  }

  validatePassword(registerForm: NgForm) {
    this.passwordErrors = [];
    if (registerForm.value.password != null) {
      this.passwordChanged = true;
      if (registerForm.value.password.length == 0) this.passwordErrors.push('Password is required.');
      if (registerForm.value.password.length < 7) this.passwordErrors.push('Password must be at least 7 characters.');
      if (!/.*[0-9].*/.test(registerForm.value.password)) this.passwordErrors.push('Password must contain at least one number.');
      if (!/[^a-zA-Z0-9]/.test(registerForm.value.password)) this.passwordErrors.push('Password must contain at least one non-alphanumeric character.');
    }
  }

}
