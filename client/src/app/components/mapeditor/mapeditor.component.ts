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
  tilePreviews: HTMLImageElement[] = [];
  tilePreviewSize = {'width': 50, 'height': 50};
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
        this.mapedTools.push(new LineTool(this, mapedtoolicons._isoTiles[2]));
        this.mapedTools.push(new BoxTool(this, mapedtoolicons._isoTiles[3]));
        this.mapedTools.push(new BucketTool(this, mapedtoolicons._isoTiles[4]));
        this.mapedTools.push(new EraserTool(this, mapedtoolicons._isoTiles[5]));
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
      });

      this.myCanvas.gameAssets.tiles.insertArray(tset._isoTiles);
      this.myCanvas.drawing.paint();
    });

  }

  renderTilePreviews() {
    if (this.myTileset) {
      this.tilePreviews = [];
      for (let tile of this.myTileset._isoTiles) {

        let pCanvas = document.createElement('canvas');
        pCanvas.width = this.tilePreviewSize.width;
        pCanvas.height = this.tilePreviewSize.height;
        let ctx = pCanvas.getContext('2d');

        if (tile.image) {
          ctx.drawImage(
            tile.image,
            tile.properties.subImageX, tile.properties.subImageY,
            tile.properties.subImageWidth, tile.properties.subImageHeight,
            0,0,
            pCanvas.width, pCanvas.height
          );
        } else {
          ctx.font = '45px Arial';
          ctx.fillStyle = 'red';
          ctx.textAlign = 'center';
          ctx.fillText('!', 25, 40);
        }
        let pimg = new Image();
        pimg.src = pCanvas.toDataURL();
        this.tilePreviews.push(pimg);
      }
    }
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
