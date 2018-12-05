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
  selectedTile = null;

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
    });
    this.tileset = new IsoTileSet();
  }

  loadtileset() {
    this.tileset.dumbLoad(() => {

    });
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
