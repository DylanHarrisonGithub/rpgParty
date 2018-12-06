import { Component, OnInit } from '@angular/core';
import { IsoCanvas } from '../../engine/isocanvas';
import { IsoTile } from '../../engine/isotile';
import { IsoTileSet } from '../../engine/isotileset';

@Component({
  selector: 'app-tileseteditor',
  templateUrl: './tileseteditor.component.html',
  styleUrls: ['./tileseteditor.component.css']
})
export class TileseteditorComponent implements OnInit {
  
  layoutVertical: boolean; // 0:horizontal, 1:vertical
  cursor = {
    'cursor': false,
    'width': 128,
    'height': 128
  }
  tileset = null;
  selectedTile: IsoTile;
  canvas: HTMLCanvasElement;

  constructor() {}

  ngOnInit() {

    this.layoutVertical = window.innerWidth < 650;
    if (this.layoutVertical) {
      document.getElementById('vcontainer').style.bottom = '200px';
      document.getElementById('toolpanelLeft').style.width = '0px';
      document.getElementById('toolpanelRight').style.width = '0px';
      document.getElementById('canvas').style.left = '0px';
      document.getElementById('canvas').style.right = '0px';
      document.getElementById('toolpanelBottom').style.height = '200px';
    } else {
      document.getElementById('vcontainer').style.bottom = '0px';
      document.getElementById('toolpanelLeft').style.width = '300px';
      document.getElementById('toolpanelRight').style.width = '300px';
      document.getElementById('canvas').style.left = '300px';
      document.getElementById('canvas').style.right = '300px';
      document.getElementById('toolpanelBottom').style.height = '0px';
    }

    window.addEventListener('resize', (ev) => {
      if (window.innerWidth < 650 != this.layoutVertical) {
        this.layoutVertical = window.innerWidth < 650;
        if (this.layoutVertical) {
          document.getElementById('vcontainer').style.bottom = '200px';
          document.getElementById('toolpanelLeft').style.width = '0px';
          document.getElementById('toolpanelRight').style.width = '0px';
          document.getElementById('canvas').style.left = '0px';
          document.getElementById('canvas').style.right = '0px';
          document.getElementById('toolpanelBottom').style.height = '200px';
        } else {
          document.getElementById('vcontainer').style.bottom = '0px';
          document.getElementById('toolpanelLeft').style.width = '300px';
          document.getElementById('toolpanelRight').style.width = '300px';
          document.getElementById('canvas').style.left = '300px';
          document.getElementById('canvas').style.right = '300px';
          document.getElementById('toolpanelBottom').style.height = '0px';
        }
      }
    });
    this.tileset = new IsoTileSet();
    
    this.canvas = document.createElement('canvas');
    document.getElementById('canvas').appendChild(this.canvas);
  }

  loadtileset() {
    this.tileset.dumbLoad(() => {});
  }

  selectTile(tile: IsoTile) {
    this.selectedTile = tile;
    this.canvas.width = this.selectedTile.image.width;
    this.canvas.height = this.selectedTile.image.height;
    let ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    ctx.drawImage(this.selectedTile.image, 0, 0);
    //console.log(this.selectedTile.properties);

  }

  templating = {
    isBoolean: (x: any) => {
      return typeof x === "boolean";
    },
    isNumber: (x: any) => {
      return typeof x === "number";
    },
    isString: (x: any) => {
      return !(this.templating.isBoolean(x) ||this.templating.isNumber(x));
    }
  }
}
