import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IsoCanvas } from 'src/app/engine/isocanvas';
import { GameMap } from 'src/app/engine/gamemap';
import { IsoTileSet } from 'src/app/engine/isotileset';
import { ActorMap } from 'src/app/engine/actormap';
import { Actor } from 'src/app/engine/actor';

import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-questeditor',
  templateUrl: './questeditor.component.html',
  styleUrls: ['./questeditor.component.css']
})
export class QuesteditorComponent implements OnInit, AfterViewInit {

  @ViewChild('qeCanvasContainer') myCanvasContainer: ElementRef;
  @ViewChild('qeToolbar') myToolbar: ElementRef;

  private myIsoCanvas: IsoCanvas;
  private myQuest: any;
  private myMap: GameMap;
  private myActorMap: ActorMap;
  private myActors: Array<Actor>;

  constructor() { }

  ngOnInit() {}
  ngAfterViewInit() {
    let gameMap = new GameMap(128, 128, new IsoTileSet());

    this.myIsoCanvas = new IsoCanvas(
      (<HTMLDivElement>this.myCanvasContainer.nativeElement),
      gameMap,
      new ActorMap(128, 128, [], gameMap)
    );
    (<HTMLDivElement>this.myCanvasContainer.nativeElement).addEventListener('mousemove', e => this.myIsoCanvas.eventListeners.defaultMouseMoveListener(e));
    (<HTMLDivElement>this.myCanvasContainer.nativeElement).addEventListener('wheel', e => {
      this.myIsoCanvas.eventListeners.defaultMouseWheelListener(e);
      this.myIsoCanvas.drawing.paint();
    });
    (<HTMLDivElement>this.myCanvasContainer.nativeElement).addEventListener('click', e => {
      this.myIsoCanvas.eventListeners.defaultMouseClickListener(e);
      this.myIsoCanvas.drawing.paint();
    });
    this.myIsoCanvas.drawing.paint();
  }

  onResized(event: ResizedEvent) {
    this.myIsoCanvas.eventListeners.defaultWindowResizeListner();
    this.myIsoCanvas.drawing.paint();
  }

}
