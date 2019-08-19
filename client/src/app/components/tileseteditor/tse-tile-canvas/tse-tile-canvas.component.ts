import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { IsoTile } from 'src/app/engine/isotile';

@Component({
  selector: 'app-tse-tile-canvas',
  templateUrl: './tse-tile-canvas.component.html',
  styleUrls: ['./tse-tile-canvas.component.css']
})
export class TseTileCanvasComponent implements OnInit, AfterViewInit {

  @Input() selectedTile: IsoTile;
  @Input() cursor: {
    public: {
      cursor: boolean,
      width: number,
      height: number
    },
    private: {
      x: number,
      y: number
    }
  } = {
    public: {
      cursor: false,
      width: 128,
      height: 128,
    },
    private: {
      x: 0,
      y: 0
    }
  };

  @ViewChild('myCanvas') myCanvas: ElementRef;
  @Output() cursorClick: EventEmitter<{
      width: number,
      height: number,
      x: number,
      y: number
  }> = new EventEmitter<{
      width: number,
      height: number,
      x: number,
      y: number
  }>();

  constructor() { }

  ngOnInit() {}
  ngAfterViewInit() {}

  resetCursor() {
    this.cursor.public.cursor = false;
    this.cursor.public.width = 128;
    this.cursor.public.height = 128;
    this.cursor.private.x = 0;
    this.cursor.private.y = 0;
  }

  render() {
    if (this.myCanvas && this.selectedTile) {

      (<HTMLCanvasElement>this.myCanvas.nativeElement).width = this.selectedTile.image.width;
      (<HTMLCanvasElement>this.myCanvas.nativeElement).height = this.selectedTile.image.height;

      let ctx: CanvasRenderingContext2D = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(
        0,0,
        (<HTMLCanvasElement>this.myCanvas.nativeElement).width, 
        (<HTMLCanvasElement>this.myCanvas.nativeElement).height
      );
      if (this.selectedTile && this.selectedTile.image) {
        ctx.fillStyle = 'white';
        ctx.fillRect(
          0,0,
          (<HTMLCanvasElement>this.myCanvas.nativeElement).width, 
          (<HTMLCanvasElement>this.myCanvas.nativeElement).height
        );
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

  mousemove(e: MouseEvent) {
    if (this.cursor.public.cursor) {
      let canvasRect = (<HTMLDivElement>e.target).getBoundingClientRect();
      let mouseCanvas = {
        "x": this.cursor.public.width*Math.floor((e.clientX-canvasRect.left) / this.cursor.public.width), 
        "y": this.cursor.public.width*Math.floor((e.clientY-canvasRect.top) / this.cursor.public.height)
      };
      if (mouseCanvas.x != this.cursor.private.x || mouseCanvas.y != this.cursor.private.y) {
        this.cursor.private.x = mouseCanvas.x;
        this.cursor.private.y = mouseCanvas.y;
        this.render();
      }
    }
  }

  click(e: MouseEvent) {
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

        this.cursorClick.emit({
          width: this.cursor.public.width,
          height: this.cursor.public.height,
          x: mouseCanvas.x,
          y: mouseCanvas.y
        });
      }
    }
  }
}
