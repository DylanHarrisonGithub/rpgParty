import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { IsoTileSet } from 'src/app/engine/isotileset';
import { IsoTile } from 'src/app/engine/isotile';

@Component({
  selector: 'app-tse-tile-picker',
  templateUrl: './tse-tile-picker.component.html',
  styleUrls: ['./tse-tile-picker.component.css']
})
export class TseTilePickerComponent implements OnInit {

  @Input() tileset: IsoTileSet = new IsoTileSet();
  @Output() select: EventEmitter<IsoTile> = new EventEmitter<IsoTile>();
  @Output() animate: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('animateButton') animateButton: ElementRef;

  tilePreviews: HTMLImageElement[] = [];
  tilePreviewSize = {'width': 50, 'height': 50};
  selectedTile: IsoTile;

  constructor() { }

  ngOnInit() {
  }

  buttons = {
    new: () => {
      this.tileset.tiles.insertOne(new IsoTile(null, {}));
      this.renderPreviews();
    },
    animate: () => {
      this.animate.emit(true);
      if ((<HTMLButtonElement>this.animateButton.nativeElement).innerHTML == 'Animate') {
        (<HTMLButtonElement>this.animateButton.nativeElement).innerHTML = 'Stop';
      } else {
        (<HTMLButtonElement>this.animateButton.nativeElement).innerHTML = 'Animate';
      }
    },
    select: (tile: IsoTile) => {
      this.select.emit(tile);
      this.selectedTile = tile;
    },
    remove: (tile: IsoTile) => {
      let index = this.tileset.tiles.indexOf(tile);
      this.tileset.tiles.removeOne(tile);
      this.tilePreviews.splice(index, 1);
    },
    moveUp: (tile: IsoTile) => {
      this.tileset.tiles.moveUp(tile);
      this.renderPreviews();
    },
    moveDown: (tile: IsoTile) => {
      this.tileset.tiles.moveDown(tile);
      this.renderPreviews();
    }
  }

  renderPreviews() {
    if (this.tileset) {
      this.tilePreviews = [];
      this.tileset.tiles.forEach((tile: IsoTile) => {
        let pCanvas: HTMLCanvasElement = document.createElement('canvas');
        pCanvas.width = this.tilePreviewSize.width;
        pCanvas.height = this.tilePreviewSize.height;
        let ctx: CanvasRenderingContext2D = pCanvas.getContext('2d');

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
      });
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

}
