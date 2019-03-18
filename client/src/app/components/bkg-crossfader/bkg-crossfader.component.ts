import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bkg-crossfader',
  templateUrl: './bkg-crossfader.component.html',
  styleUrls: ['./bkg-crossfader.component.css']
})
export class BkgCrossfaderComponent implements OnInit {

  imgPath = '../../../assets/wallpapers/';
  numWallpapers = 5;
  transparent = false;
  delay = 10000;
  top = 0;
  bottom = 1;

  constructor() { }

  ngOnInit() {
    setInterval(() => {
      this.transparent = !this.transparent;
      setTimeout(() => {
        if (this.transparent) {
          this.top = ((this.top + 2) % this.numWallpapers);
        } else {
          this.bottom = ((this.bottom + 2) % this.numWallpapers);
        }
      }, this.delay / 2);
    }, this.delay)
  }

  private getSrcTop(): string {
    return this.imgPath + (this.top + 1) + '.jpg';
  }

  private getSrcBottom(): string {
    return this.imgPath + (this.bottom + 1) + '.jpg';
  }

}
