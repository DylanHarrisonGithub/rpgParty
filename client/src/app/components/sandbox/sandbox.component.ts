import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { TouchpadComponent } from '../controller/touchpad/touchpad.component';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myTouchpad') myTouchpad: TouchpadComponent;

  public touchpadConfig = {
    inactiveColor: '#d3d3d3',
    activeColor: '#ff1090',
    analog: false,
    digitalSectors: 8
  }
  touchpadData = { x: 0, y: 0 };
  touchpadDataSubscription;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.touchpadDataSubscription = this.myTouchpad.touchpadData().subscribe(tpdata => {
        this.touchpadData = tpdata;
      });
    });
  }

  ngOnDestroy() {
    this.touchpadDataSubscription.unsubscribe();
  }

}
