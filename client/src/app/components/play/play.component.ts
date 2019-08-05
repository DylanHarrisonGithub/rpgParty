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
    let tset = new IsoTileSet();
    tset.loadFromServer('http://localhost:3000/assets/tilesets/dirt.json', () => {
      let anim = new IsoTileSet();
      anim.loadFromServer('http://localhost:3000/assets/tilesets/animationtest.json', () => {
        this.myTileset = tset;
        this.myMap = GameMap.generateRandomMap(64, 64, 1, tset); //new GameMap(64, 64, tset); //
        this.myActors = [new Actor(0,0,0,0,100,[anim],anim)];
        this.myActorMap = new ActorMap(64, 64, this.myActors);
        this.myCanvas = new IsoCanvas(
          this.myCanvasElement.nativeElement, 
          this.myMap,
          this.myActorMap
        );
        
        this.myCanvas.gameAssets.tileset.set(tset);
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
          //this.players.forEach(player => {
          //  player.x += player.vx*(1/26);
          //  player.y += player.vy*(1/26);
          //});
          this.myActorMap.stage(1/26, this.myMap);
          this.paint();
          //console.log(
          //  this.myActors[0].x,
          //  this.myActors[0].y,
          //  this.myActors[0].vx, 
          //  this.myActors[0].vy
          //);
        }, 1000/26);
      });
      
    });

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
            case 'up':
              player[0].x--;
              player[0].y--;
              break;
            case 'down':
              player[0].x++;
              player[0].y++;
              break;
            case 'left':
              player[0].x--;
              player[0].y++;
              break;
            case 'right':
              player[0].x++;
              player[0].y--;
              break;
            case 'touchPad':
              //player[0].vx = msg.msg.data.x*Math.cos(-Math.PI/4) - msg.msg.data.y*Math.sin(-Math.PI/4);
              //player[0].vy = msg.msg.data.x*Math.sin(-Math.PI/4) + msg.msg.data.y*Math.cos(-Math.PI/4);
              this.myActors[0].vx = msg.msg.data.x*Math.cos(-Math.PI/4) - msg.msg.data.y*Math.sin(-Math.PI/4);
              this.myActors[0].vy = msg.msg.data.x*Math.sin(-Math.PI/4) + msg.msg.data.y*Math.cos(-Math.PI/4);
              //this._toastrService.show(JSON.stringify(player[0]), 'Touch');
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

  paint() {
    let ctx = <CanvasRenderingContext2D>this.myCanvas.drawing.getContext();
    this.myCanvas.drawing.clearCanvas(ctx);
    this.myCanvas.drawing.drawIsoTilesWithinCanvasFrame(ctx);
    let coords;
    let r = this.myCanvas.metrics.getCanvasTileSize();
    this.players.forEach(player => {
      coords = this.myCanvas.transformations.isoToCanvas({
        'x': player.x,
        'y': player.y
      });
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, r.x*.25, 0, 2*Math.PI);
      ctx.fill();
    }); 
  }
}