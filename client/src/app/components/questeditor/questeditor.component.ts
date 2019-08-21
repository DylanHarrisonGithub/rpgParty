import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IsoCanvas } from 'src/app/engine/isocanvas';
import { GameMap } from 'src/app/engine/gamemap';
import { IsoTileSet } from 'src/app/engine/isotileset';
import { ActorMap } from 'src/app/engine/actormap';
import { Actor } from 'src/app/engine/actor';

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
    //(<HTMLDivElement>this.myCanvasContainer.nativeElement).addEventListener('mousemove', this.myIsoCanvas.eventListeners.defaultMouseMoveListener);
    //(<HTMLDivElement>this.myCanvasContainer.nativeElement).addEventListener('scroll', this.myIsoCanvas.eventListeners.defaultMouseWheelListener);
    //(<HTMLDivElement>this.myCanvasContainer.nativeElement).addEventListener('click', this.myIsoCanvas.eventListeners.defaultMouseClickListener);
    this.myIsoCanvas.drawing.paint();
  }

}
