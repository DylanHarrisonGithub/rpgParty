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

@Component({
  selector: 'app-mapeditor',
  templateUrl: './mapeditor.component.html',
  styleUrls: ['./mapeditor.component.css']
})
export class MapeditorComponent implements OnInit, AfterViewInit {

  @ViewChild('myTilepicker') myTilepicker: TilepickerComponent;
  
  myCanvas: IsoCanvas;
  myMap: GameMap;
  myTileset: IsoTileSet;
  selectedTile: IsoTile;
  selectedTool: MapEdTool;
  mapedTools: MapEdTool[];
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

    this.myTilepicker.getSelectedTileSubscription().subscribe((selectedTile: IsoTile) => { this.selectedTile = selectedTile });

    FileIO.isoTileSet.loadFromServer([
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/brickwall.json',
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/mapedtools.json'
    ]).then((res: Array<IsoTileSet>) => {

      let tset, mapedtoolicons;
      if (res[0].properties.tileSetName === 'mapedtools') {
        tset = res[1];
        mapedtoolicons = res[0];
      } else {
        tset = res[0];
        mapedtoolicons = res[1];
      }

      this.myTileset = tset;
      this.selectedTile = this.myTileset.tiles.get(0);
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

      this.mapedTools = new Array<MapEdTool>();
      this.mapedTools.push(new HandTool(this.myCanvas, mapedtoolicons.tiles.get(0)));
      this.mapedTools.push(new BrushTool(this, mapedtoolicons.tiles.get(1)));
      this.mapedTools.push(new LineTool(this, mapedtoolicons.tiles.get(2)));
      this.mapedTools.push(new BoxTool(this, mapedtoolicons.tiles.get(3)));
      this.mapedTools.push(new BucketTool(this, mapedtoolicons.tiles.get(4)));
      this.mapedTools.push(new EraserTool(this, mapedtoolicons.tiles.get(5)));
      this.buttons.tools.select(this.mapedTools[0]);
      let ican = document.getElementById('isocanvas');     
      ican.addEventListener('click', (ev) => {
        this.selectedTool.mouseClickListener(ev);
      });
      ican.addEventListener('mousemove', (ev) => {
        this.selectedTool.mouseMoveListener(ev);
      });
      ican.addEventListener('wheel', (ev) => {
        this.selectedTool.mouseWheelListener(ev);
      });
      ican.addEventListener('mousedown', (ev) => {
        this.selectedTool.mouseDownListener(ev);
      });
      ican.addEventListener('mouseup', (ev) => {
        this.selectedTool.mouseUpListener(ev);
      });

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
    tools: {
      select: (tool: MapEdTool) => { 
        this.selectedTool = tool;
      }
    },
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
