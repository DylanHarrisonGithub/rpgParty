import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { UserService } from '../../services/user.service';

import { IsoCanvas } from '../../engine/isocanvas';
import { GameMap } from '../../engine/gamemap';
import { IsoTile } from '../../engine/isotile';
import { IsoTileSet } from '../../engine/isotileset';
import { SocketService } from 'src/app/services/socket.service';
import { ValidationService } from 'src/app/services/validation.service';

import { ToastrService } from 'ngx-toastr';
import { ActorMap } from 'src/app/engine/actormap';
import { Actor } from 'src/app/engine/actor';

import config from '../../config/config.json';
import { FileIO } from 'src/app/engine/fileIO';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, AfterViewInit, OnDestroy {

  private myCanvas: IsoCanvas;
  private myMap: GameMap;
  private myActorMap: ActorMap;
  private myTileset: IsoTileSet;
  private myActors: Array<Actor>;
  portraitPath = "../../../assets/";
  
  private mySockSubstription;
  players = [];
  private colors = [
    '#FF0000',
    '#FFA500',
    '#FFFF00',
    '#800080',
    '#008000',
    '#4682B4',
    '#FF1493',
    '#000000'
  ];
  @ViewChild('canvas') private myCanvasElement: ElementRef;


  constructor(
    private _userService: UserService,
    private _socketService: SocketService,
    private _validationService: ValidationService,
    private _toastrService: ToastrService
  ) { }

  ngOnInit() {
    //this.players = this._userService.roommates;
    //console.log(this._userService.roommates);
    let i = 0;
    this._userService.roommates.forEach(player => {
      this.players.push({
        actor: null,
        color: this.colors[i],
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        p: player
      });
      i++;
    });
  }

  ngAfterViewInit() {
    FileIO.isoTileSet.loadFromServer([
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/dirt.json',
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/walk0.json',
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/walk1.json',
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/walk2.json',
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/walk3.json',
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/walk4.json',
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/walk5.json',
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/walk6.json',
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/walk7.json'
    ]).then((res: Array<IsoTileSet>) => {

      console.log(res);
      let walkAnimation: Array<IsoTileSet> = Array<IsoTileSet>(8).fill(null);
      res.forEach((tileset: IsoTileSet) => {
        switch(tileset.properties.tileSetName) {
          case 'dirt':
            this.myTileset = tileset;
            break;
          case 'walk0':
            walkAnimation[4] = tileset;
            break;
          case 'walk1':
            walkAnimation[3] = tileset;
            break;
          case 'walk2':
            walkAnimation[2] = tileset;
            break;
          case 'walk3':
            walkAnimation[1] = tileset;
            break;
          case 'walk4':
            walkAnimation[0] = tileset;
            break;
          case 'walk5':
            walkAnimation[7] = tileset;
            break;
          case 'walk6':
            walkAnimation[6] = tileset;
            break;
          case 'walk7':
            walkAnimation[5] = tileset;
            break;
        }
      });
      console.log(walkAnimation);

      this.myMap = GameMap.generateRandomMap(64, 64, 2, this.myTileset); //new GameMap(64, 64, tset); //
      this.myActors = new Array<Actor>();
      this.players.forEach(player => {
        let a = new Actor(0,0,0,0,100,walkAnimation,walkAnimation[0]);
        player.actor = a;
        this.myActors.push(a);
      });
      this.myActorMap = new ActorMap(64, 64, this.myActors, this.myMap);
      this.myCanvas = new IsoCanvas(
        this.myCanvasElement.nativeElement, 
        this.myMap,
        this.myActorMap
      );

      this.myCanvas.gameAssets.tileset.set(this.myTileset);
      this.paint();
      window.addEventListener('resize', (ev) => {
        this.paint();
      });
      this.myCanvasElement.nativeElement.addEventListener('click', (ev) => {
        this.myCanvas.eventListeners.defaultMouseClickListener(ev);
        this.paint();
      });
      this.myCanvasElement.nativeElement.addEventListener('mousemove', (ev) => this.myCanvas.eventListeners.defaultMouseMoveListener(ev));
      this.myCanvasElement.nativeElement.addEventListener('wheel', (ev) => {
        this.myCanvas.eventListeners.defaultMouseWheelListener(ev);
        this.paint();
      });
      
      //timer
      setInterval(() => {
        this.myActorMap.stage(1/26, this.myMap);
        this.paint();
      }, 1000/26);

    }).catch(err => console.log(err));

    //router
    this.mySockSubstription = this._socketService.onMessage().subscribe(msg => {
      let err = this._validationService.validate(msg, {
        'from': {
          'required': true,
          'type': 'string'
        },
        'msg': {
          'required': true,
          'type': {
            'route': {
              'required': true,
              'type': 'string'
            }
          }
        }
      });
      if (err.length) {
        console.log(err);
      } else {
        let player = this.players.filter(p => msg.from == p.p.soc_id);
        if (player.length === 1) {
          switch(msg.msg.route) {
            case 'touchPad':
              let theta = Math.atan2(-msg.msg.data.y, msg.msg.data.x); 
              if (theta < 0) theta += Math.PI*2;
              let n = Math.floor((8*theta)/(2*Math.PI));
              player[0].actor.vx = msg.msg.data.x*Math.cos(-Math.PI/4) - msg.msg.data.y*Math.sin(-Math.PI/4);
              player[0].actor.vy = msg.msg.data.x*Math.sin(-Math.PI/4) + msg.msg.data.y*Math.cos(-Math.PI/4);
              player[0].actor.setCurrentAnimation(n);
              break;
            default:
              break;
          }
        }
      }
    });

  }

  ngOnDestroy() {
    if (this.mySockSubstription) {
      this.mySockSubstription.unsubscribe();
    }
  }

  paint(): void {
    let ctx = <CanvasRenderingContext2D>this.myCanvas.drawing.getContext();
    this.myCanvas.drawing.clearCanvas(ctx);
    this.myCanvas.drawing.drawIsoTilesWithinCanvasFrame(ctx);
  }
}