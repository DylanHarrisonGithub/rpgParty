import { IsoTileSet } from './isotileset';
import { GameMap } from './gamemap';
import { ActorMap } from './actormap';
import { IsoTile } from './isotile';

export class Actor {

  public x: number = 0;
  public y: number = 0;
  public vx: number = 0;
  public vy: number = 0;
  
  public jumpHeight = .5;

  public isClipped: boolean = false;
  public stacks: boolean = false;

  private animations: Array<IsoTileSet>;
  private currentAnimation: IsoTileSet;
  private currentFrame: IsoTile;
  private animationTimer: number = 0;

  constructor(x0: number, y0: number, vx0: number, vy0: number, jumpHeight: number, animations: Array<IsoTileSet>, currentAnimation: IsoTileSet) {
    this.x = x0;
    this.y = y0;
    this.vx = vx0;
    this.vy = vy0;
    this.jumpHeight = jumpHeight;
    this.animations = animations;
    this.currentAnimation = currentAnimation;
    this.animate(0);
  }

  public getCell() {
    return {
      "x": Math.floor(this.x),
      "y": Math.floor(this.y)
    }
  }

  public getCurrentFrame(): IsoTile {
    return this.currentFrame;
  }

  public animate(dt) {

    // assumption: 
    // dt >= 0;
    // this.currentAnimation.properties.fps != 0
    this.animationTimer += dt;
    this.animationTimer = this.animationTimer - Math.floor( (this.animationTimer*this.currentAnimation.properties.fps)/this.currentAnimation.tiles.getLength() )*this.currentAnimation.tiles.getLength()/this.currentAnimation.properties.fps;

    this.currentFrame = this.currentAnimation.tiles.get(Math.floor(this.animationTimer*this.currentAnimation.properties.fps ));

  }

  public move(dt: number, gamemap: GameMap, actormap: ActorMap): void {

    this.x = this.x + this.vx*dt;
    this.y = this.y + this.vy*dt;
    //let newCellX = Math.floor(x);
    //let newCellY = Math.floor(y);

    let cellX = Math.floor(this.x);
    let cellY = Math.floor(this.y);

    //if ((cellX != newCellX) || (cellY != newCellY)) {
    //  if (Math.abs(gamemap.getCellStackingHeight(newCellX, newCellY) - gamemap.getCellStackingHeight(cellX, cellY)) <= this.jumpHeight) {
    //    this.x = x;
    //    this.y = y;
     // }
    //}
  }
}