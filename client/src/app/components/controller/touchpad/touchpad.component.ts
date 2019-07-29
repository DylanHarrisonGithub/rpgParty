import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-touchpad',
  templateUrl: './touchpad.component.html',
  styleUrls: ['./touchpad.component.css']
})
export class TouchpadComponent implements OnInit, AfterViewInit {

  @ViewChild('touchpadDiv') private touchpadDivElementRef: ElementRef;
  @ViewChild('touchpadCanvas') private touchpadCanvasElementRef: ElementRef;
  private touchpadDiv: HTMLDivElement;
  private touchpadCanvas: HTMLCanvasElement;
  private highlight: HTMLImageElement;
  private mx: number;
  private my: number;

  @Input() config = {
    inactiveColor: '#d3d3d3',
    activeColor: '#ff1090',
    analog: false,
    digitalSectors: 8
  };
  @Input() width;
  
  private mouseDown: boolean = false;
  private mousedataBehaviorSubject: BehaviorSubject<any>;
  private mousedata = { mx: 0, my: 0 };
  private canvasData = {
    canvasWidth: 0,
    canvasHeight: 0,
    halfCanvasWidth: 0,
    halfCanvasHeight: 0,
    canvasWidthInverse: 0,
    canvasHeightInverse: 0
  };

  constructor() { }

  ngOnInit() { 
    this.mousedataBehaviorSubject = new BehaviorSubject<any>(this.mousedata);
  }

  ngAfterViewInit() {
    
    //prerender highlight
    let AHC: HTMLCanvasElement = document.createElement('canvas');
    AHC.width = 140;
    AHC.height = 140;
    let actx = AHC.getContext('2d');
    let aGradient = actx.createRadialGradient(70, 70, 5, 70, 70, 70);
    aGradient.addColorStop(0, 'white');
    aGradient.addColorStop(1, this.config.activeColor);
    actx.arc(70, 70, 60, 0, 2*Math.PI);
    actx.fillStyle = aGradient;
    actx.fill();
    this.highlight = new Image();
    this.highlight.src = AHC.toDataURL('image/png');

    this.touchpadDiv = <HTMLDivElement>this.touchpadDivElementRef.nativeElement;
    this.touchpadCanvas = <HTMLCanvasElement>this.touchpadCanvasElementRef.nativeElement;
    
    this.touchpadCanvas.width = this.touchpadDiv.clientWidth;
    this.touchpadCanvas.height = this.touchpadDiv.clientHeight;
    this.canvasData.canvasWidth = this.touchpadDiv.clientWidth;
    this.canvasData.canvasHeight = this.touchpadDiv.clientHeight;
    this.canvasData.halfCanvasWidth = this.touchpadDiv.clientWidth / 2;
    this.canvasData.halfCanvasHeight = this.touchpadDiv.clientHeight / 2;
    this.canvasData.canvasWidthInverse = 1 / this.touchpadDiv.clientWidth;
    this.canvasData.canvasHeightInverse = 1 / this.touchpadDiv.clientHeight;
    this.paint();
    setInterval(() => {
      if (this.mouseDown) {
        this.calcMouseData();
        this.paint(); 
      }
    }, 1000/26);
  }

  onResized(event: ResizedEvent) {
    if (this.touchpadCanvas) {
      this.touchpadCanvas.width = event.newWidth;
      this.touchpadCanvas.height = event.newHeight;
      this.canvasData.canvasWidth = event.newWidth;
      this.canvasData.canvasHeight = event.newHeight;
      this.canvasData.halfCanvasWidth = event.newWidth / 2;
      this.canvasData.halfCanvasHeight = event.newHeight / 2;
      this.canvasData.canvasWidthInverse = 1 / event.newWidth;
      this.canvasData.canvasHeightInverse = 1 / event.newHeight;
      this.paint();
    }
  }
  private calcMouseData(): void {
    let rect = this.touchpadCanvas.getBoundingClientRect();
    let mx = 2*(this.mx - rect.left - this.canvasData.halfCanvasWidth)*this.canvasData.canvasWidthInverse;
    let my = 2*(this.my - rect.top - this.canvasData.halfCanvasHeight)*this.canvasData.canvasHeightInverse;
    let mag = mx*mx + my*my;
    if (mag > .5) {
      let m = 1 / (Math.sqrt(mag));
      mx = mx*m;
      my = my*m;
    }
    if (!this.config.analog && mag != 0) {
      if (mag > .25) {
        let theta = Math.atan2(my, mx);
        theta = Math.round((this.config.digitalSectors*theta)/(2*Math.PI))*(2*Math.PI)/this.config.digitalSectors;
        mx = Math.cos(theta);
        my = Math.sin(theta);
      } else {
        mx = 0;
        my = 0;
      }
    }
    if (mx != this.mousedata.mx || my != this.mousedata.my) {
      this.mousedata.mx = mx;
      this.mousedata.my = my;
      this.mousedataBehaviorSubject.next(this.mousedata);
    }
  }
  mousedown(event): void {
    this.mx = event.clientX;
    this.my = event.clientY;
    this.mouseDown = true;
    this.calcMouseData();
    this.paint();
  }
  mousemove(event): void {
    if (this.mouseDown) {
      this.mx = event.clientX;
      this.my = event.clientY;
    }
  }
  mouseup(event): void { 
    this.mouseDown = false;
    this.mousedata.mx = 0;
    this.mousedata.my = 0;
    this.mousedataBehaviorSubject.next(this.mousedata);
    this.paint(); 
  }
  touchstart(event): void {
    this.mx = event.touches[0].clientX;
    this.my = event.touches[0].clientY;
    this.mouseDown = true;
    this.calcMouseData();
    this.paint();
  }
  touchmove(event): void {
    if (this.mouseDown) {
      this.mx = event.touches[0].clientX;
      this.my = event.touches[0].clientY;
    }
  }
  touchend(event): void { 
    this.mouseDown = false;
    this.mousedata.mx = 0;
    this.mousedata.my = 0;
    this.mousedataBehaviorSubject.next(this.mousedata);
    this.paint(); 
  }

  public paint(): void {

    let ctx: CanvasRenderingContext2D = this.touchpadCanvas.getContext('2d');
    
    let mx = (this.mousedata.mx/2 + 1)*this.canvasData.halfCanvasWidth;
    let my = (this.mousedata.my/2 + 1)*this.canvasData.halfCanvasHeight;
    if (this.mouseDown) {
      ctx.fillStyle = this.config.activeColor;
      ctx.fillRect(0,0,this.touchpadCanvas.width, this.touchpadCanvas.height);
      ctx.drawImage(this.highlight, mx-70, my-70);
    } else {
      ctx.fillStyle = this.config.inactiveColor;      
      ctx.fillRect(0,0,this.touchpadCanvas.width, this.touchpadCanvas.height);
      let gradient = ctx.createRadialGradient(mx, my, 5, mx, my, 70);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, this.config.inactiveColor);
      ctx.arc(mx, my, 60, 0, 2*Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  public touchpadData(): Observable<any> {
    //return new BehaviorSubject<any>(this.mousedata).asObservable();
    return this.mousedataBehaviorSubject.asObservable();
  } 
}
