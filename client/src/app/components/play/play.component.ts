import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { UserService } from '../../services/user.service';

import { IsoCanvas } from '../../engine/isocanvas';
import { GameMap } from '../../engine/gamemap';
import { IsoTile } from '../../engine/isotile';
import { IsoTileSet } from '../../engine/isotileset';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, AfterViewInit {

  private myCanvas: IsoCanvas;
  private myMap: GameMap;
  private myTileset: IsoTileSet;
  portraitPath = "../../../assets/";
  
  players = [];
  @ViewChild('canvas') private myCanvasElement: ElementRef;

  constructor(
    private _userService: UserService
  ) { }

  ngOnInit() {
    this.players = this._userService.roommates;
    console.log(this._userService.roommates);
  }

  ngAfterViewInit() {
    let tset = new IsoTileSet();
    tset.loadFromServer('http://localhost:3000/assets/tilesets/brickwall.json', () => {
      this.myTileset = tset;
      this.myMap = new GameMap(64, 64, tset); //GameMap.generateRandomMap(64, 64, 1, tset);
      this.myCanvas = new IsoCanvas(this.myCanvasElement.nativeElement, this.myMap);
      
      this.myCanvas.gameAssets.tileset.set(tset);
      this.myCanvas.drawing.paint();
      window.addEventListener('resize', (ev) => {
        this.myCanvas.drawing.paint();
      });
      this.myCanvasElement.nativeElement.addEventListener('click', (ev) => this.myCanvas.eventListeners.defaultMouseClickListener(ev));
      this.myCanvasElement.nativeElement.addEventListener('mousemove', (ev) => this.myCanvas.eventListeners.defaultMouseMoveListener(ev));
      this.myCanvasElement.nativeElement.addEventListener('wheel', (ev) => this.myCanvas.eventListeners.defaultMouseWheelListener(ev));
    });
  }

}
