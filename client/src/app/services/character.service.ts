import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import config from '../config/config.json';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(
    private _http: HttpClient,
    private _authService: AuthService
  ) { }

  getCharacters() {
    return this._http.get(config.URI[config.ENVIRONMENT] + 'character',
      {
        headers: new HttpHeaders().set('Authorization', this._authService.getToken())
      }
    );
  }

  deleteCharacter(_id: String) {
    return this._http.delete(config.URI[config.ENVIRONMENT] + 'character/' + _id,
      {
        headers: new HttpHeaders().set('Authorization', this._authService.getToken())
      }
    );
  }

  createCharacter(char) {
    return this._http.post(config.URI[config.ENVIRONMENT] + 'character/create',
      {
        owner_id: this._authService.getUserDetails()['_id'],
        name: char.name,
        class: char.class
      },
      {
        headers: new HttpHeaders().set('Authorization', this._authService.getToken())
      }
    );
  }
}
