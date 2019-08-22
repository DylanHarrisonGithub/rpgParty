import { Item } from '../Item';

export class Potion extends Item {

  permanent: boolean;
  duration: number;

  health: number;
  magic: number;

  attack: number;
  defense: number;

  strength: number;
  speed: number;
  intelligence: number;
  vitality: number;

}