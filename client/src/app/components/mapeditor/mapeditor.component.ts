import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IsoCanvas } from '../../engine/isocanvas';
import { GameMap } from '../../engine/gamemap';
import { IsoTile } from '../../engine/isotile';
import { IsoTileSet } from '../../engine/isotileset';
import { MapEdTool, HandTool, BrushTool, LineTool, BoxTool, BucketTool, EraserTool } from '../../engine/mapedtools/mapedtool';
import { TileseteditorComponent } from '../tileseteditor/tileseteditor.component';
import { ActorMap } from 'src/app/engine/actormap';
import { FileIO } from 'src/app/engine/fileIO';

import config from '../../config/config.json';
import { TilepickerComponent } from './tilepicker/tilepicker.component';
import { ToolpickerComponent } from './toolpicker/toolpicker.component';

@Component({
  selector: 'app-mapeditor',
  templateUrl: './mapeditor.component.html',
  styleUrls: ['./mapeditor.component.css']
})
export class MapeditorComponent implements OnInit, AfterViewInit {

  @ViewChild('myTilepicker') myTilepicker: TilepickerComponent;
  @ViewChild('myToolpicker') myToolpicker: ToolpickerComponent;

  myCanvas: IsoCanvas;
  myMap: GameMap;
  myTileset: IsoTileSet;
  selectedTile: IsoTile;
  layoutVertical: boolean; // 0:horizontal, 1:vertical
  activeMouseListeners = {
    mouseclick: null,
    mousewheel: null,
    mousemove: null
  }

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.layoutVertical = window.innerHeight > window.innerWidth;
    if (this.layoutVertical) {
      document.getElementById('vcontainer').style.bottom = '200px';
      document.getElementById('toolpanel1').style.width = '0px';
      document.getElementById('isocanvas').style.right = '0px';
      document.getElementById('toolpanel2').style.height = '200px';
    } else {
      document.getElementById('vcontainer').style.bottom = '0px';
      document.getElementById('toolpanel1').style.width = '300px';
      document.getElementById('isocanvas').style.right = '300px';
      document.getElementById('toolpanel2').style.height = '0px';
    }

    this.myTilepicker.getSelectedTileSubscription().subscribe((selectedTile: IsoTile) => { 
      this.selectedTile = selectedTile 
    });

    FileIO.isoTileSet.loadFromServer([
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/brickwall.json'
    ]).then((res: Array<IsoTileSet>) => {

      let tset = res[0];
      this.myTileset = tset;
      this.myMap = new GameMap(64, 64, tset); //GameMap.generateRandomMap(64, 64, 1, tset);
      this.myCanvas = new IsoCanvas(
        <HTMLDivElement>document.getElementById('isocanvas'), 
        this.myMap,
        new ActorMap(64, 64, [], this.myMap)
      );      
      this.myCanvas.gameAssets.tileset.set(tset);
      window.addEventListener('resize', (ev) => {      
        if (window.innerHeight > window.innerWidth != this.layoutVertical) {
          this.layoutVertical = window.innerHeight > window.innerWidth;
          if (this.layoutVertical) {
            document.getElementById('vcontainer').style.bottom = '200px';
            document.getElementById('toolpanel1').style.width = '0px';
            document.getElementById('isocanvas').style.right = '0px';
            document.getElementById('toolpanel2').style.height = '200px';
          } else {
            document.getElementById('vcontainer').style.bottom = '0px';
            document.getElementById('toolpanel1').style.width = '300px';
            document.getElementById('isocanvas').style.right = '300px';
            document.getElementById('toolpanel2').style.height = '0px';
          }
        }
        this.myCanvas.drawing.paint();
      });
      document.onkeypress = (event) => {
        if (event.key == 'r') {
          this.myCanvas.transformations.rotate(1);
          this.myCanvas.drawing.paint();
        }
      };

      this.myToolpicker.init(this);
      this.myCanvas.drawing.paint();
    }).catch(err => console.log(err));
  }

  templating = {
    typeCheckers: {
      isBoolean: (x: any) => { return typeof x === "boolean"; },
      isNumber: (x: any) => { return typeof x === "number"; },
      isString: (x: any) => { 
        return !(this.templating.typeCheckers.isBoolean(x) || this.templating.typeCheckers.isNumber(x));
      }
    },
    trackByFn(index,item){ return item.key; }
  };

  buttons = {
    map: {
      new: () => {
        this.myMap = new GameMap(this.myMap.getSize.x(), this.myMap.getSize.y(), this.myTileset);
        this.myCanvas.gameAssets.setMap(this.myMap);
        this.myCanvas.drawing.paint();
      },
      load: () => {
        FileIO.gameMap.loadFromClient().then((map: GameMap) => {
          this.myTileset = map.getTileSet();
          this.myMap = new GameMap(this.myMap.getSize.x(), this.myMap.getSize.y(), this.myTileset);
          this.myMap.setMap(map.getMap());
          this.myCanvas.gameAssets.tileset.set(this.myTileset);
          this.myCanvas.gameAssets.setMap(this.myMap);
          this.myCanvas.drawing.paint();
        }).catch(err => console.log(err));
      },
      save: () => {
        FileIO.gameMap.save(this.myMap);
      }
    }
  }

  newTilesetLoaded() {
    this.myMap = new GameMap(this.myMap.getSize.x(), this.myMap.getSize.y(), this.myTileset);
    this.myCanvas.gameAssets.tileset.set(this.myTileset);
    this.myCanvas.gameAssets.setMap(this.myMap);
    this.myCanvas.drawing.paint();
  }
}
