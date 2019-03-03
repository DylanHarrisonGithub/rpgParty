import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public navbarCollapsed = true;

  constructor(
    private _authService: AuthService
  ) { }

  ngOnInit() {
  }

  delayedCollapse() {    
    if (!this.navbarCollapsed) {
      setTimeout(() => {
          document.getElementById('navbar-hamburger').click();
      }, 250);
    }
  }

  onLogout() {
    this._authService.logout();
  }
  
}
