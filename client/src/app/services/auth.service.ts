import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;

  constructor(
    private _router: Router
  ) { }

  saveToken(token: string): void {
    sessionStorage.setItem('rpgParty', token);
    this.token = token;
  }

  getToken(): string {
    if (!this.token) {
      this.token = sessionStorage.getItem('rpgParty');
    }
    return this.token;
  }

  logout(): void {
    this.token = null;
    sessionStorage.removeItem('rpgParty');
    this._router.navigate(['home']);
  }

  getUserDetails() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
}
