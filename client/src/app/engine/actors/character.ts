import { Actor } from '../actor';
import { IsoTileSet } from '../isotileset';

export class Character extends Actor {
  
  isNPC: boolean;
  walkAnimations: Array<IsoTileSet>;
  attackAnimations: Array<IsoTileSet>;
}