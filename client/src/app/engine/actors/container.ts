import { Actor } from '../actor';
import { IsoTile } from '../isotile';
import { IsoTileSet } from '../isotileset';

export class Container extends Actor {
  
  public locked: boolean = false;
  public closed: boolean = true;
  public closedTile: IsoTile;
  public openedTile: IsoTile;
  public openingAnimation: IsoTileSet;
  public closingAnimation: IsoTileSet;

}