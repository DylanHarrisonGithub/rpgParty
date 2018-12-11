import { Component, OnInit } from '@angular/core';
import { IsoCanvas } from '../../engine/isocanvas';
import { GameMap } from '../../engine/gamemap';
import { IsoTile } from '../../engine/isotile';
import { IsoTileSet } from '../../engine/isotileset';
import { MapEdTool, HandTool, BrushTool, LineTool, BoxTool, BucketTool, EraserTool } from '../../engine/mapedtools/mapedtool';

@Component({
  selector: 'app-mapeditor',
  templateUrl: './mapeditor.component.html',
  styleUrls: ['./mapeditor.component.css']
})
export class MapeditorComponent implements OnInit {

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

  private tileTemplateLength: number;

  constructor() { }

  ngOnInit() {

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

    let tset = new IsoTileSet();
    tset.loadFromServer('http://localhost:3000/assets/tilesets/terrain.json', () => {
      this.myTileset = tset;
      
      this.selectedTile = this.myTileset._isoTiles[0];
      this.tileTemplateLength = Math.floor(tset._isoTiles.length / 4) - 1;
      this.myMap = new GameMap(64, 64, tset); //GameMap.generateRandomMap(64, 64, 1, tset);
      this.myCanvas = new IsoCanvas(<HTMLDivElement>document.getElementById('isocanvas'), this.myMap);

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

      let mapedtoolicons = new IsoTileSet();
      mapedtoolicons.loadFromServer('http://localhost:3000/assets/tilesets/mapedtools.json', () => {
        this.mapedTools = new Array<MapEdTool>();
        this.mapedTools.push(new HandTool(this.myCanvas, mapedtoolicons._isoTiles[0]));
        this.mapedTools.push(new BrushTool(this, mapedtoolicons._isoTiles[1]));
        this.mapedTools.push(new LineTool(this.myCanvas, this.myMap, mapedtoolicons._isoTiles[2]));
        this.mapedTools.push(new BoxTool(this.myCanvas, this.myMap, mapedtoolicons._isoTiles[3]));
        this.mapedTools.push(new BucketTool(this, mapedtoolicons._isoTiles[4]));
        this.mapedTools.push(new EraserTool(this, mapedtoolicons._isoTiles[5]));
        this.buttons.tools.select(this.mapedTools[0]);
        document.getElementById('isocanvas').addEventListener('click', (ev) => {
          this.selectedTool.mouseClickListener(ev);
        });
        document.getElementById('isocanvas').addEventListener('mousemove', (ev) => {
          this.selectedTool.mouseMoveListener(ev);
        });
        document.getElementById('isocanvas').addEventListener('wheel', (ev) => {
          this.selectedTool.mouseWheelListener(ev);
        });
      });

      this.myCanvas.gameAssets.tiles.insertArray(tset._isoTiles);
      this.myCanvas.drawing.paint();
    });



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
    tiles: {
      select: (tile: IsoTile) => { this.selectedTile = tile; }
    },
    tools: {
      select: (tool: MapEdTool) => { 
        this.selectedTool = tool;
      }
    }
  }
}
