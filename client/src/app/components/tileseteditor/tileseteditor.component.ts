import { Component, OnInit } from '@angular/core';
import { IsoTile } from '../../engine/isotile';
import { IsoTileSet } from '../../engine/isotileset';

@Component({
  selector: 'app-tileseteditor',
  templateUrl: './tileseteditor.component.html',
  styleUrls: ['./tileseteditor.component.css']
})
export class TileseteditorComponent implements OnInit {
  
  layoutVertical = false; // false:horizontal, true:vertical
  cursor = {
    public: {
      'cursor': false,
      'width': 128,
      'height': 128,
    },
    private: {
      'x': 0,
      'y': 0
    }
  };
  autoSplit = {
    'cellWidth': 1,
    'cellDepth': 1,
    isoToCanvas: (x, y) => {
      if (this.selectedTile && this.selectedTile.image) {
        let w = this.selectedTile.properties.subImageWidth;
        let h = this.selectedTile.properties.subImageHeight;
        let cellHeight = (2*(h/w) - 1) * ((this.autoSplit.cellWidth + this.autoSplit.cellDepth) / 2);
        return {
          'x': ((x-y+this.autoSplit.cellDepth)/(this.autoSplit.cellWidth+this.autoSplit.cellDepth))*w,
          'y': ((x+y+2* cellHeight)/(this.autoSplit.cellWidth+this.autoSplit.cellDepth+2*cellHeight))*h
        }
      } else {
        return undefined;
      }
    }
  };
  tileset: IsoTileSet = null;
  selectedTile: IsoTile;
  tilePreviews: HTMLImageElement[] = [];
  tilePreviewSize = {'width': 50, 'height': 50};
  canvas: HTMLCanvasElement;
  isAnimating = false;

  constructor() {}

  ngOnInit() {

    this.tileset = new IsoTileSet();
    this.canvas = document.createElement('canvas');
    document.getElementById('canvas').appendChild(this.canvas);

    // responsive layout
    this.eventListeners.window.resize();

    window.addEventListener('resize', (ev) => { this.eventListeners.window.resize() });    
    this.canvas.addEventListener('mousemove', (e) => { this.eventListeners.canvas.mouseMove(e) });
    this.canvas.addEventListener('click', (e) => { this.eventListeners.canvas.mouseClick(e) });

  }

  render = {
    tilePreviews: () => {
      if (this.tileset) {
        this.tilePreviews = [];
        this.tileset.tiles.forEach((tile, i) => {
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
        });
      }
    },
    selectedTile: () => {
      let ctx = this.canvas.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
      if (this.selectedTile && this.selectedTile.image) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
        ctx.drawImage(this.selectedTile.image, 0, 0);
        if (this.cursor.public.cursor) {
          ctx.beginPath();
          ctx.strokeStyle = 'green';
          ctx.rect(
            this.cursor.private.x,
            this.cursor.private.y,
            this.cursor.public.width,
            this.cursor.public.height
          )
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.rect(
          this.selectedTile.properties.subImageX,
          this.selectedTile.properties.subImageY,
          this.selectedTile.properties.subImageWidth,
          this.selectedTile.properties.subImageHeight
        );
        ctx.stroke();
      }
    }
  }

  buttons = {
    tileSet: {
      new: () => {
        this.cursor = {
          public: {
            'cursor': false,
            'width': 128,
            'height': 128,
          },
          private: {
            'x': 0,
            'y': 0
          }
        }
        this.tileset = new IsoTileSet();
        this.selectedTile = null;
        this.tilePreviews = [];
      },
      load: () => {
        this.cursor = {
          public: {
            'cursor': false,
            'width': 128,
            'height': 128,
          },
          private: {
            'x': 0,
            'y': 0
          }
        }
        this.tileset = new IsoTileSet();
        this.selectedTile = null;
        this.tilePreviews = [];
        this.tileset.dumbLoad(() => {
          this.render.tilePreviews();
        });
      },
      save: () => { this.tileset.dumbSave(); },
      join: () => {
        let jSet = new IsoTileSet();
        jSet.dumbLoad(() => {
          this.tileset.union(jSet);
          this.render.tilePreviews();
        });
      }
    },
    image: {
      import: () => { this.tileset.loadImageFromClient(()=>{}); },
      assign: (img: HTMLImageElement) => {
        if (this.selectedTile) {
          this.selectedTile.properties.subImageX = 0;
          this.selectedTile.properties.subImageY = 0;
          this.selectedTile.properties.subImageWidth = img.width;
          this.selectedTile.properties.subImageHeight = img.height;
          this.canvas.width = img.width;
          this.canvas.height = img.height;
          this.selectedTile.image = img;
          this.render.tilePreviews();
          this.render.selectedTile();
        }
      },       
      remove: (image: HTMLImageElement) => {
        this.tileset.images.remove(image);
        this.render.tilePreviews();
        this.render.selectedTile();
      }
    },
    tile: {
      new: () => {
        this.tileset.tiles.insertOne(new IsoTile(null, {}));
        this.render.tilePreviews();
      },
      animate: () => { 
        if (this.tileset.properties.isAnimation && this.tileset.properties.fps > 0) {
          if (this.isAnimating) {
            let btns = document.getElementsByClassName('rp-animate-button');
            // ??? can't iterate over htmlcollection?
            for (let btn of <any>btns) { btn.innerHTML = "Animate" }
            this.isAnimating = false;
          } else {
            let btns = document.getElementsByClassName('rp-animate-button');
            for (let btn of <any>btns) { btn.innerHTML = "Stop" }
            this.isAnimating = true;
            let tileNum = 0;
            let timeoutFunction = () => {
              setTimeout(() => {
                if (tileNum == this.tileset.tiles.getLength()) {
                  if (!this.tileset.properties.animationLoops || (this.tileset.tiles.getLength() == 0)) {                    
                    let btns = document.getElementsByClassName('rp-animate-button');
                    for (let btn of <any>btns) { btn.innerHTML = "Animate" }
                    this.isAnimating = false;
                  } else {
                    tileNum = 0;
                    this.buttons.tile.select(this.tileset.tiles.get(tileNum));
                    tileNum++;
                    if (this.isAnimating && (this.tileset.properties.fps > 0)) {
                      timeoutFunction();
                    }
                  }
                } else {
                  this.buttons.tile.select(this.tileset.tiles.get(tileNum));
                  tileNum++;
                  if (this.isAnimating && (this.tileset.properties.fps > 0)) {
                    timeoutFunction();
                  }
                }
              }, 1000.0 / this.tileset.properties.fps);
            };
            timeoutFunction();
          }
        }
      },
      select: (tile: IsoTile) => {
        this.selectedTile = tile;
        if (this.selectedTile.image) {
          this.canvas.width = this.selectedTile.image.width;
          this.canvas.height = this.selectedTile.image.height;
        } else {
          this.canvas.width = 128;
          this.canvas.height = 128;
        }
        this.render.selectedTile();
      },
      remove: (tile: IsoTile) => {
        let index = this.tileset.tiles.indexOf(tile);
        this.tilePreviews.splice(index, 1);
        this.tileset.tiles.removeOne(tile);
      },
      moveUp: (tile: IsoTile) => {
        this.tileset.tiles.moveUp(tile);
        this.render.tilePreviews();
      },
      moveDown: (tile: IsoTile) => {
        this.tileset.tiles.moveDown(tile);
        this.render.tilePreviews();
      }
    },
    autoSplit: {
      split: () => {
        if (this.selectedTile && this.selectedTile.image) {
          if (this.autoSplit.cellWidth > 0 && this.autoSplit.cellDepth > 0) {

            let width = this.autoSplit.isoToCanvas(1,0).x - this.autoSplit.isoToCanvas(0,1).x;
            let height = this.autoSplit.isoToCanvas(1,1).y;
            for (let y = 0; y < this.autoSplit.cellDepth; y++) {
              for (let x = 0; x < this.autoSplit.cellWidth; x++) {
                this.tileset.tiles.insertOne(new IsoTile(this.selectedTile.image, {
                  subImageX: this.selectedTile.properties.subImageX + this.autoSplit.isoToCanvas(x-1, y).x,
                  subImageY: this.selectedTile.properties.subImageY + this.autoSplit.isoToCanvas(x+1,y+1).y - height,
                  subImageWidth: width,
                  subImageHeight: height
                }));
              }
            }
            this.render.tilePreviews();

          }
        }
      },

    }
  };

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

  eventListeners = {
    window: {
      resize: () => {
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
      }
    },
    canvas: {
      mouseMove: (e: MouseEvent) => {
        if (this.cursor.public.cursor) {
          let canvasRect = (<HTMLDivElement>e.target).getBoundingClientRect();
          let mouseCanvas = {
            "x": this.cursor.public.width*Math.floor((e.clientX-canvasRect.left) / this.cursor.public.width), 
            "y": this.cursor.public.width*Math.floor((e.clientY-canvasRect.top) / this.cursor.public.height)
          };
          if (mouseCanvas.x != this.cursor.private.x || mouseCanvas.y != this.cursor.private.y) {
            this.cursor.private.x = mouseCanvas.x;
            this.cursor.private.y = mouseCanvas.y;
            this.render.selectedTile();
          }
        }
      },
      mouseClick: (e: MouseEvent) => {
        if (this.cursor.public.cursor) {
          let canvasRect = (<HTMLDivElement>e.target).getBoundingClientRect();
          let mouseCanvas = {
            "x": this.cursor.public.width*Math.floor((e.clientX-canvasRect.left) / this.cursor.public.width), 
            "y": this.cursor.public.width*Math.floor((e.clientY-canvasRect.top) / this.cursor.public.height)
          };
          if (
            mouseCanvas.x != this.selectedTile.properties.subImageX ||
            mouseCanvas.y != this.selectedTile.properties.subImageY ||
            this.cursor.public.width != this.selectedTile.properties.subImageWidth ||
            this.cursor.public.height != this.selectedTile.properties.subImageHeight
          ) {

            this.selectedTile.properties.subImageX = mouseCanvas.x;
            this.selectedTile.properties.subImageY = mouseCanvas.y;
            this.selectedTile.properties.subImageWidth = this.cursor.public.width;
            this.selectedTile.properties.subImageHeight = this.cursor.public.height;

            this.render.tilePreviews();

          }
        }
      }
    }
  };
}
