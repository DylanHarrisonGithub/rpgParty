import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../config/config.json';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user;
  activeCharacter;
  room;
  soc_id;
  tv_soc;
  roommates = [];
  isTV = false;
  
  constructor(
    private _http: HttpClient
  ) { }

  postUser(user: any) {
    return this._http.post(config.URI[config.ENVIRONMENT] + 'user/register', user).pipe(map(user => {
      if (user.hasOwnProperty('user')) {
        this.user = user['user'];
      }
      return user;
    }));;
  }

  isUniqueUsername(user: any) {
    return this._http.post(config.URI[config.ENVIRONMENT] + 'user/isUniqueUsername', user);
  }
  isUniqueEmail(user: any) {
    return this._http.post(config.URI[config.ENVIRONMENT] + 'user/isUniqueEmail', user);
  }

  login(user: any) {
    return this._http.post(config.URI[config.ENVIRONMENT] + 'user/login', user).pipe(map(user => {
      if (user.hasOwnProperty('user')) {
        this.user = user['user'];
      }
      return user;
    }));
  }
}
