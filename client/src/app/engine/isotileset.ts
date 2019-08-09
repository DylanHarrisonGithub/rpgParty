import { IsoTile } from './isotile';
export class IsoTileSet {

  public properties = {
    tileSetName: 'untitled set',
    isAnimation: false,
    animationLoops: false,
    fps: 0.0
  };
  private _images: HTMLImageElement[] = [];
  private _isoTiles: IsoTile[] = [];
  private _subTiles: IsoTile[] = [];

  constructor() {}

  tiles = {
    getLength: (): number => { return this._isoTiles.length; },
    get: (index: number): IsoTile => {
      if (index > -1 && index < this.tiles.getLength()) {
        return this._isoTiles[index];
      } else {
        return null;
      }
    },
    insertOne: (tile: IsoTile): void => { 
      this._isoTiles.push(tile);
      for (let subtile of tile.subTiles) {
        this._subTiles.push(subtile);
      }
    },
    insertArray: (tileArray: IsoTile[]): void => { 
      for (let tile of tileArray) this.tiles.insertOne(tile);
    },
    removeOne: (tile: IsoTile): void => { 
      let index = this._isoTiles.indexOf(tile);
      if (index > -1) {
        this._isoTiles.splice(index, 1);
        for (let subtile of tile.subTiles) {
          let subIndex = this._subTiles.indexOf(subtile);
          if (subIndex > -1) this._subTiles.splice(subIndex, 1);
        }
      }
    },
    removeArray: (tileArray: IsoTile[]): void => {
      for (let tile of tileArray) this.tiles.removeOne(tile);
    },
    contains: (tile: IsoTile): boolean => { return (this._isoTiles.indexOf(tile) > -1) },
    indexOf: (tile: IsoTile): number => { return (this._isoTiles.indexOf(tile)) },
    forEach: (f: (value: IsoTile, index: number) => any): void => { 
      for (let i = 0; i < this._isoTiles.length; i++) {
        f(this._isoTiles[i], i);
      }
    },
    moveUp: (tile: IsoTile): void => {
      if (this.tiles.contains(tile)) {
        let index = this.tiles.indexOf(tile);
        if (index > 0) {
          let temp = this._isoTiles[index-1];
          this._isoTiles[index-1] = this._isoTiles[index];
          this._isoTiles[index] = temp;
        }
      }
    },
    moveDown: (tile: IsoTile): void => {
      if (this.tiles.contains(tile)) {
        let index = this.tiles.indexOf(tile);
        if (index < (this.tiles.getLength()-1)) {
          let temp = this._isoTiles[index+1];
          this._isoTiles[index+1] = this._isoTiles[index];
          this._isoTiles[index] = temp;
        }
      }
    }
  };
  subTiles = {
    contains: (subTile: IsoTile): boolean => { return this._subTiles.indexOf(subTile) > -1; },
    indexOf: (subTile: IsoTile): number => { return this._subTiles.indexOf(subTile); },
    get: (index: number): IsoTile => {
      return this._subTiles[index];
    },
    forEach: (f: (value: IsoTile, index: number) => any): void => { 
      for (let i = 0; i < this._subTiles.length; i++) {
        f(this._subTiles[i], i);
      }
    }
  }
  images = {
    insert: (images: HTMLImageElement | Array<HTMLImageElement>): void => {
      if (images instanceof HTMLImageElement) {
        this._images.push(images);
      } else {
        this._images = this._images.concat(images);
      }
    },
    remove: (image: HTMLImageElement): HTMLImageElement => {
      if (this.images.contains(image)) {
        let removed = this._images.splice(this._images.indexOf(image), 1)[0];
        this._isoTiles.forEach(tile => {
          if (tile.image == image) tile.image = null;
        });
        return removed;
      } else {
        return null;
      }
    },
    contains: (image: HTMLImageElement): boolean => {
      return this._images.indexOf(image) > -1;
    },
    indexOf: (image: HTMLImageElement): number => {
      return this._images.indexOf(image);
    },
    get: (index: number): HTMLImageElement => {
      if (index >= 0 && index < this._images.length) {
        return this._images[index];
      } else {
        return null;
      }
    },
    forEach: (f: (value: HTMLImageElement, index: number) => any): void => {
      for (let i = 0; i < this._images.length; i++) {
        f(this._images[i], i);
      }
    }
  }

  union(tileSet: IsoTileSet): void {
    for (let image of tileSet._images) {
      if (!this.images.contains(image)) {
        this._images.push(image);
      }
    }
    for (let tile of tileSet._isoTiles) {
      this.tiles.insertOne(new IsoTile(
        this._images[this._images.indexOf(tile.image)],
        JSON.parse(JSON.stringify(tile.properties))     // clone json obj hack
      ));
    }
  }

}