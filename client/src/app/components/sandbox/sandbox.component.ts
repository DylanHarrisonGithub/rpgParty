import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { TouchpadComponent } from '../controller/touchpad/touchpad.component';
import { TilepickerComponent } from '../mapeditor/tilepicker/tilepicker.component';
import { IsoTileSet } from 'src/app/engine/isotileset';
import { FileIO } from 'src/app/engine/fileIO';

import config from '../../config/config.json';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myTouchpad') myTouchpad: TouchpadComponent;
  @ViewChild('myTilepicker') myTilepicker: TilepickerComponent;

  public touchpadConfig = {
    inactiveColor: '#d3d3d3',
    activeColor: '#ff1090',
    analog: false,
    digitalSectors: 8
  }
  touchpadData = { x: 0, y: 0 };
  touchpadDataSubscription;

  public tileset: IsoTileSet;

  constructor() { }

  ngOnInit() {
    FileIO.isoTileSet.loadFromServer([
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/brickwall.json'
    ]).then(res => this.tileset = res[0]).catch(err => console.log(err));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.touchpadDataSubscription = this.myTouchpad.touchpadData().subscribe(tpdata => {
        this.touchpadData = tpdata;
      });
    });
  }

  ngOnDestroy() {
    this.touchpadDataSubscription.unsubscribe();
  }

  tl() {
    console.log(this.tileset.tiles.getLength());
  }

}
