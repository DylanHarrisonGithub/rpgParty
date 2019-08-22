import { Actor } from '../actor';
import { IsoTile } from '../isotile';

export class Item extends Actor {
  
  name: string;
  description: string;
  mapTile: IsoTile;
  inventoryIcon: IsoTile;
  value: number;
  weight: number;

}