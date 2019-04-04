import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxImgCrossfaderComponent } from 'ngx-img-crossfader';

@Component({
  selector: 'app-bkg-crossfader',
  templateUrl: './bkg-crossfader.component.html',
  styleUrls: ['./bkg-crossfader.component.css']
})
export class BkgCrossfaderComponent implements OnInit {

  private imgPath = '../../../assets/wallpapers/';
  myImageSources = [
    this.imgPath + '1.jpg',
    this.imgPath + '2.jpg',
    this.imgPath + '3.jpg',
    this.imgPath + '4.jpg',
    this.imgPath + '5.jpg',
  ]

  @ViewChild('myCrossfader') myCrossfader: NgxImgCrossfaderComponent;

  constructor() { }

  ngOnInit() {}

  next() { this.myCrossfader.stepForward(); }
  back() { this.myCrossfader.stepBackward(); }

}
