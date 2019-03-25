import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public navbarCollapsed = true;

  // collapse navbar on click outside of navbar 
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      if (!this.navbarCollapsed) {
        document.getElementById('navbar-hamburger').click();
      }
    }
  }

  constructor(
    private _authService: AuthService,
    private _elementRef: ElementRef
  ) { }

  ngOnInit() { }

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
