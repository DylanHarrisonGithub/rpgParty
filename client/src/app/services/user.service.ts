import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpClient
  ) { }

  postUser(user: any) {
    return this._http.post('http://localhost:3000/user/register', user);
  }

  isUniqueUsername(user: any) {
    return this._http.post('http://localhost:3000/user/isUniqueUsername', user);
  }
  isUniqueEmail(user: any) {
    return this._http.post('http://localhost:3000/user/isUniqueEmail', user);
  }

  login(user: any) {
    return this._http.post('http://localhost:3000/user/login', user);
  }
}
