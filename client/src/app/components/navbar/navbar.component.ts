import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public navbarCollapsed = true;

  constructor() { }

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
    //this._authService.logout();
  }
  
}
