import { Component, OnInit } from '@angular/core';
import { IsoCanvas } from '../../engine/isocanvas';
import { IsoTile } from '../../engine/isotile';
import { IsoTileSet } from '../../engine/isotileset';

@Component({
  selector: 'app-mapeditor',
  templateUrl: './mapeditor.component.html',
  styleUrls: ['./mapeditor.component.css']
})
export class MapeditorComponent implements OnInit {

  myCanvas: IsoCanvas;
  layoutVertical: boolean; // 0:horizontal, 1:vertical

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
    
    this.myCanvas = new IsoCanvas(<HTMLDivElement>document.getElementById('isocanvas'));
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
    document.getElementById('isocanvas').addEventListener('click', (ev) => {                                
      this.myCanvas.eventListeners.defaultMouseClickListener(ev);
      this.myCanvas.drawing.paint();
    });
    document.getElementById('isocanvas').addEventListener('wheel', (ev) => {
      this.myCanvas.eventListeners.defaultMouseWheelListener(ev);
      this.myCanvas.drawing.paint();
    });
    document.onkeypress = (event) => {
        if (event.key == 'r') {
          this.myCanvas.transformations.rotate(1);
          this.myCanvas.drawing.paint();
        }
    };

    let tset = new IsoTileSet();
    tset.loadFromServer('http://localhost:3000/assets/tilesets/dirt.json', () => {
      this.myCanvas._gameAssets.tiles = tset._isoTiles;
      this.myCanvas.generateRandomMap(64, 64, 1);
      this.myCanvas.drawing.paint();
    });
    this.myCanvas.drawing.paint();
    
  }

}
