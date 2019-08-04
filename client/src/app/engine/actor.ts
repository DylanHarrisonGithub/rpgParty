import { IsoTileSet } from './isotileset';
import { GameMap } from './gamemap';
import { ActorMap } from './actormap';

export class Actor {

  private x: number = 0;
  private y: number = 0;
  private vx: number = 0;
  private vy: number = 0;

  private animations: Array<IsoTileSet>;
  private currentAnimation: IsoTileSet;

  private jumpHeight = .5;

  constructor(x0: number, y0: number, vx0: number, vy0: number, jumpHeight: number) {
    this.x = x0;
    this.y = y0;
    this.vx = vx0;
    this.vy = vy0;
    this.jumpHeight = jumpHeight;
  }

  public getCell() {
    return {
      "x": Math.floor(this.x),
      "y": Math.floor(this.y)
    }
  }

  public move(dt: number, gamemap: GameMap, actormap: ActorMap) {

    let x = this.x + this.vx*dt;
    let y = this.y + this.vy*dt;
    let newCellX = Math.floor(x);
    let newCellY = Math.floor(y);

    let cellX = Math.floor(this.x);
    let cellY = Math.floor(this.y);

    if ((cellX != newCellX) || (cellY != newCellY)) {
      if (Math.abs(gamemap.getCellStackingHeight(newCellX, newCellY) - gamemap.getCellStackingHeight(cellX, cellY)) <= this.jumpHeight) {
        this.x = x;
        this.y = y;
      }
    }
  }
}