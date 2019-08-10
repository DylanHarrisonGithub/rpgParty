import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { IsoCanvas } from '../../engine/isocanvas';
import { GameMap } from '../../engine/gamemap';
import { IsoTile } from '../../engine/isotile';
import { IsoTileSet } from '../../engine/isotileset';
import { ActorMap } from 'src/app/engine/actormap';
import { FileIO } from 'src/app/engine/fileIO';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import config from '../../config/config.json';
import { TilepickerComponent } from './tilepicker/tilepicker.component';
import { ToolpickerComponent } from './toolpicker/toolpicker.component';

import { NewMapDialogComponent } from '../modals/new-map-dialog/new-map-dialog.component';

@Component({
  selector: 'app-mapeditor',
  templateUrl: './mapeditor.component.html',
  styleUrls: ['./mapeditor.component.css']
})
export class MapeditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myTilepicker') myTilepicker: TilepickerComponent;
  @ViewChild('myToolpicker') myToolpicker: ToolpickerComponent;

  @ViewChild('myIsoCanvas') myIsoCanvas: ElementRef;

  myCanvas: IsoCanvas;
  myMap: GameMap;
  myTileset: IsoTileSet;
  selectedTile: IsoTile;

  constructor(private _modalService: NgbModal) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.myTilepicker.getSelectedTileSubscription().subscribe((selectedTile: IsoTile) => { 
      this.selectedTile = selectedTile 
    });

    FileIO.isoTileSet.loadFromServer([
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/brickwall.json'
    ]).then((res: Array<IsoTileSet>) => {

      this.myTileset = res[0];
      this.myMap = new GameMap(64, 64, this.myTileset);
      this.myCanvas = new IsoCanvas(
        this.myIsoCanvas.nativeElement, 
        this.myMap,
        new ActorMap(64, 64, [], this.myMap)
      );      
      this.myCanvas.gameAssets.tileset.set(this.myTileset);

      document.onkeypress = (event) => {
        if (event.key == 'r') {
          this.myCanvas.transformations.rotate(1);
          this.myCanvas.drawing.paint();
        }
      };
      window.addEventListener('resize', ev => {
        this.myCanvas.eventListeners.defaultWindowResizeListner(ev);
        this.myCanvas.drawing.paint();
      });

      this.myToolpicker.init(this);
      this.myCanvas.drawing.paint();
    }).catch(err => console.log(err));
  }

  ngOnDestroy() {

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
        let newMapModal = this._modalService.open(NewMapDialogComponent);
        newMapModal.result.then(res => {
          this.myMap = new GameMap(res.xSize, res.ySize, this.myTileset);
          this.myMap.title = res.title;
          this.myCanvas.gameAssets.setMap(this.myMap);
          this.myCanvas.drawing.paint();
        }).catch(err => {});
      },
      load: () => {
        FileIO.gameMap.loadFromClient().then((map: GameMap) => {
          this.myTileset = map.getTileSet();
          this.myMap = map;
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
