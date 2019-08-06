import { Actor } from './actor';
import { GameMap } from './gamemap';

export class ActorMap {

  private _xSize: number;
  private _ySize: number;
  private _tileMap: GameMap;
  private _map: Array<Array<Array<Actor>>>;
  private _actorList: Array<Actor>;

  constructor(xSize: number, ySize: number, actorList: Array<Actor>, tileMap: GameMap) {

    this._xSize = xSize;
    this._ySize = ySize;
    this._map = new Array<Array<Array<Actor>>>();
    this._actorList = actorList;
    this._tileMap = tileMap;
     
    // initialize map
    for (let y = 0; y < this._ySize; y++) {
      this._map.push([]);
      for (let x = 0; x < this._xSize; x++) {
          this._map[y].push([]);
      }
    }

    this.pushActors();
  }

  public getCell(x: number, y: number): Array<Actor> | null {
    if ((x >= 0 && y >= 0) && (x < this._xSize && y < this._ySize)) {
      return this._map[y][x];
    } else {
      return null;
    }
  }

  public stage(dt: number, gameMap: GameMap): void {
    this.popActors();
    this._actorList.forEach(actor => {
      actor.animate(dt);
      actor.move(dt, gameMap, this);
    });
    this.pushActors();
  }

  private pushActors() {
    this._actorList.forEach(actor => {
      let cell = actor.getCell();
      if ((cell.x >= 0 && cell.x < this._xSize - 1) && (cell.y >= 0 && cell.y < this._ySize - 1)) {
        actor.height = this._tileMap.getCellStackingHeight(cell.x, cell.y);
        this._map[cell.y+1][cell.x+1].push(actor);
      }
    });
  }

  private popActors() {
    this._actorList.forEach(actor => {
      let cell = actor.getCell();
      if ((cell.x >= 0 && cell.x < this._xSize - 1) && (cell.y >= 0 && cell.y < this._ySize -1)) {
        this._map[cell.y+1][cell.x+1].pop();
      }
    });
  }
}