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
  top = 1;
  bottom = 2;

  constructor() { }

  ngOnInit() {
    setInterval(() => {
      this.transparent = !this.transparent;
      setTimeout(() => {
        if (this.transparent) {
          this.top = ((this.top + 1) % this.numWallpapers) + 1;
        } else {
          this.bottom = ((this.bottom + 1) % this.numWallpapers) + 1;
        }
      }, this.delay / 2);
    }, this.delay)
  }

  private getSrcTop(): string {
    return this.imgPath + this.top + '.jpg';
  }

  private getSrcBottom(): string {
    return this.imgPath + this.bottom + '.jpg';
  }

}
