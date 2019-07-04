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

  @Input() config = {
    inactiveColor: '#d3d3d3',
    activeColor: '#ff1090',
    analogMagnitude: false,
    analogDirection: false
  };
  @Input() width;
  
  private mouseDown: boolean = false;
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

  ngOnInit() { }

  ngAfterViewInit() {
    this.touchpadDiv = <HTMLDivElement>this.touchpadDivElementRef.nativeElement;
    this.touchpadCanvas = <HTMLCanvasElement>this.touchpadCanvasElementRef.nativeElement;
    this.touchpadCanvas.width = this.touchpadDiv.clientWidth;
    this.touchpadCanvas.height = this.touchpadDiv.clientHeight;
    
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
      if (this.mouseDown) { this.paint(); }
    }, 1000/10);
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
  private calcMouseData(event): void {
    let rect = event.target.getBoundingClientRect();
    let mx = 2*(event.clientX - rect.left - this.canvasData.halfCanvasWidth)*this.canvasData.canvasWidthInverse;
    let my = 2*(event.clientY - rect.top - this.canvasData.halfCanvasHeight)*this.canvasData.canvasHeightInverse;
    let mag = mx*mx + my*my;
    if (mag > 1) {
      let m = 1 / Math.sqrt(mag);
      mx = mx*m;
      my = my*m;
    }
    this.mousedata.mx = mx;
    this.mousedata.my = my;
  }
  mousedown(event): void { 
    this.mouseDown = true;
    let rect = event.target.getBoundingClientRect();
    this.calcMouseData(event);
    this.paint();
  }
  mousemove(event): void {
    if (this.mouseDown) {
      let rect = event.target.getBoundingClientRect();
      this.calcMouseData(event);
    }
  }
  mouseup(event): void { 
    this.mouseDown = false;
    this.mousedata.mx = 0;
    this.mousedata.my = 0;
    this.paint(); 
  }

  public paint(): void {
    // createradialgradient is performance expensive. 
    // prerender gradient as png and use drawimage
    let ctx: CanvasRenderingContext2D = this.touchpadCanvas.getContext('2d');
    let mx = (this.mousedata.mx + 1)*this.canvasData.halfCanvasWidth;
    let my = (this.mousedata.my + 1)*this.canvasData.halfCanvasHeight;
    if (this.mouseDown) {
      ctx.fillStyle = this.config.activeColor;
      ctx.fillRect(0,0,this.touchpadCanvas.width, this.touchpadCanvas.height);
      let gradient = ctx.createRadialGradient(mx, my, 5, mx, my, 70);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, this.config.activeColor);
      ctx.arc(mx, my, 60, 0, 2*Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
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
    return new BehaviorSubject<any>(this.mousedata).asObservable();
  } 
}
