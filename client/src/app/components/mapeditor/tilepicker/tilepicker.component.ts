import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TilesetLoadDialogComponent } from '../../modals/tileset-load-dialog/tileset-load-dialog.component';

import { FileIO } from 'src/app/engine/fileIO';
import { IsoTileSet } from 'src/app/engine/isotileset';
import { IsoTile } from 'src/app/engine/isotile';

import config from '../../../config/config.json';

@Component({
  selector: 'app-tilepicker',
  templateUrl: './tilepicker.component.html',
  styleUrls: ['./tilepicker.component.css']
})
export class TilepickerComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() tilePreviewSize: number = 70;

  @Input() tileset: IsoTileSet = new IsoTileSet();
  @Output() tilesetChange: EventEmitter<IsoTileSet> = new EventEmitter<IsoTileSet>(); 
  @Output() newTilesetLoaded: EventEmitter<boolean> =  new EventEmitter<boolean>();

  public selectedTilePreviewImg: HTMLImageElement;

  private selectedTile: BehaviorSubject<IsoTile> = new BehaviorSubject<IsoTile>(null);
  private tilePreviews: Array<HTMLDivElement> = [];
  @ViewChild('tilePreviewSpan') private tilePreviewSpan: ElementRef;
  
  constructor(private _modalService: NgbModal) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.resetTilePreviews();
  }

  ngOnChanges() {
    if (this.tileset) {
      this.resetTilePreviews();
      if (this.tileset.tiles.getLength()) {
        this.buttons.tiles.select(this.tileset.tiles.get(0));
      }
    }
  }

  resetTilePreviews() {
    if (this.tileset) {
      this.tilePreviews = [];
      this.tileset.tiles.forEach((tile,i) => {
        let pCanvas = document.createElement('canvas');
        pCanvas.width = this.tilePreviewSize;
        pCanvas.height = this.tilePreviewSize;
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
        pimg.addEventListener("click", (e) => {
          this.buttons.tiles.select(tile);
        });
        this.tilePreviews.push(pimg);
      });
    }
    (<HTMLSpanElement>this.tilePreviewSpan.nativeElement).innerHTML = '';
    for (var i = 0; i < this.tilePreviews.length; i += 4) {
      let div = document.createElement('div');
      div.appendChild(this.tilePreviews[i]);
      if (i+1 < this.tilePreviews.length) {
        div.appendChild(this.tilePreviews[i+1]);
        if (i+2 < this.tilePreviews.length) {
          div.appendChild(this.tilePreviews[i+2]);
          if (i+3 < this.tilePreviews.length) { 
            div.appendChild(this.tilePreviews[i+3]); 
          }
        }
      }
      (<HTMLSpanElement>this.tilePreviewSpan.nativeElement).appendChild(div);
    }
  }

  buttons = {
    tiles: { 
      select: (tile: IsoTile) => {
        if (tile) {
          this.selectedTilePreviewImg = tile.image;
        } else {
          this.selectedTilePreviewImg = null;
        }
        this.selectedTile.next(tile);
      }
    },
    tileset: {
      load: () => {
        let tilesetModal = this._modalService.open(TilesetLoadDialogComponent);
        tilesetModal.result.then(res => {
          if (res === 'Upload a custom tile set') {
            FileIO.isoTileSet.loadFromClient().then((newTileSets: Array<IsoTileSet>) => {
              if (newTileSets.length) {
                let newTileSet = new IsoTileSet();
                newTileSets.forEach((tileset: IsoTileSet) => { newTileSet.union(tileset); });
                this.tileset = newTileSet;
                this.resetTilePreviews();
                if (this.tileset.tiles.getLength()) { 
                  this.buttons.tiles.select(this.tileset.tiles.get(0));
                } else {
                  this.buttons.tiles.select(null);
                }
                this.tilesetChange.emit(this.tileset);
                this.newTilesetLoaded.emit(true);
              }
            }).catch(err => console.log(err));
          } else {
            FileIO.isoTileSet.loadFromServer(config.URI[config.ENVIRONMENT] + 'assets/tilesets/' + res).then((newTileSets: Array<IsoTileSet>) => {
              if (newTileSets.length) {
                let newTileSet = new IsoTileSet();
                newTileSets.forEach((tileset: IsoTileSet) => { newTileSet.union(tileset); });
                this.tileset = newTileSet;
                this.resetTilePreviews();
                if (this.tileset.tiles.getLength()) { 
                  this.buttons.tiles.select(this.tileset.tiles.get(0));
                } else {
                  this.buttons.tiles.select(null);
                }
                this.tilesetChange.emit(this.tileset);
                this.newTilesetLoaded.emit(true);
              }
            }).then(err => console.log(err));
          }
        }).catch(err => console.log(err));
      },
      join: () => {
        let tilesetModal = this._modalService.open(TilesetLoadDialogComponent);
        tilesetModal.result.then(res => {
          if (res === 'Upload a custom tile set') {
            FileIO.isoTileSet.loadFromClient().then((newTileSets: Array<IsoTileSet>) => {
              newTileSets.forEach((tileset: IsoTileSet) => { this.tileset.union(tileset); });
              this.resetTilePreviews();
              this.tilesetChange.emit(this.tileset);
            }).catch(err => console.log(err));
          } else {
            FileIO.isoTileSet.loadFromServer(config.URI[config.ENVIRONMENT] + 'assets/tilesets/' + res).then((res: Array<IsoTileSet>) => {
              res.forEach((tileset: IsoTileSet) => { this.tileset.union(tileset); });
              this.resetTilePreviews();
              this.tilesetChange.emit(this.tileset);
            }).then(err => console.log(err));
          }
        }).catch(err => console.log(err));
      }
    }
  }

  getSelectedTileSubscription(): Observable<IsoTile> { return this.selectedTile.asObservable(); }

}
