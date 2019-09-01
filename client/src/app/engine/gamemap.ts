import { IsoTile } from './isotile';
import { IsoTileSet } from './isotileset';
export class GameMap {
    
    private _map: Array<Array<Array<{
        tileIndex: number,
        alpha: number
    }>>>;
    private _heightmap = [];
    private _tileset: IsoTileSet;
    public title = "untitledmap";
    private _properties = {
        xSize: 0,
        ySize: 0
    }

    constructor(xSize: number, ySize: number, tileset: IsoTileSet) {
        this._tileset = tileset;
        this._properties.xSize = xSize;
        this._properties.ySize = ySize;
        this._map = [];

        // initialize map / heightmap
        for (let y = 0; y < this._properties.ySize; y++) {
            this._map.push([]);
            this._heightmap.push([]);
            for (let x = 0; x < this._properties.xSize; x++) {
                this._map[y].push([]);
                this._heightmap[y].push({
                    "stackingHeight": 0,
                    "tileHeight": 0,
                    "topTile": null
                });
            }
        }
    }

    getSize = {
        x: () => { return this._properties.xSize; },
        y: () => { return this._properties.ySize; }
    }
    getMap() {
        return this._map;
    }
    setMap(map) {
        this._map = map;
        this.calculateHeightMap();
    }
    getTileSet() {
        return this._tileset;
    }
    getCellStackingHeight(x: number, y: number) {
        if (x > -1 && y > -1 && x < this.getSize.x() && y < this.getSize.y()) {
            return this._heightmap[y][x].stackingHeight;
        } else {
            return null;
        }
    }

    getCellTileHeight(x: number, y: number) {
        if (x > -1 && y > -1 && x < this.getSize.x() && y < this.getSize.y()) {
            return this._heightmap[y][x].tileHeight;
        } else {
            return null;
        }        
    }

    getTile(x: number, y: number, z: number): IsoTile {
        return this._tileset.tiles.get(this._map[y][x][z].tileIndex);
    }
    getTileIndex(x: number, y: number, z: number): number {
        return this._map[y][x][z].tileIndex;
    }
    getCell(x: number, y: number): Array<{tileIndex: number, alpha: number}> {
        if (x > -1 && y > -1 && x < this.getSize.x() && y < this.getSize.y()) {
            return this._map[y][x];
        } else {
            return null;
        }
    }

    tileFits(x: number, y: number, tile: IsoTile): boolean {
        if (x > -1 && y > -1 
        && x < this.getSize.x() - tile.properties.cellWidth
        && y < this.getSize.y() - tile.properties.cellDepth) {
            let canFit = true;
            let cellHeight = this._heightmap[y][x].stackingHeight;
            for (let i = 0; i < tile.properties.cellDepth; i++) {
                for (let j = 0; j < tile.properties.cellWidth; j++) {
                    if (cellHeight != this._heightmap[y+i][x+j].stackingHeight) {
                        canFit = false;
                    }
                }
            }
            return canFit;
        } else {
            return false;
        }
    }
    push(x: number, y: number, tile: IsoTile, alpha?: number) {
        let index = this._tileset.tiles.indexOf(tile);
        if (index > -1) {
            if (this.tileFits(x,y,tile)) {
                for (let i = 0; i < tile.properties.cellDepth; i++) {
                    for (let j = 0; j < tile.properties.cellWidth; j++) {
                        let t = tile.subTiles[j + i*tile.properties.cellWidth];
                        let subIndex = this._tileset.subTiles.indexOf(t);
                        if (subIndex > -1) {
                            if (alpha) {
                                this._map[y+i][x+j].push({
                                    tileIndex: subIndex, alpha: alpha
                                });
                            } else {
                                this._map[y+i][x+j].push({
                                    tileIndex: subIndex, alpha: 1.0
                                });
                            }
                            this._heightmap[y+i][x+j].stackingHeight += t.properties.cellHeight;
                            this._heightmap[y+i][x+j].tileHeight++;
                            this._heightmap[y+i][x+j].topTile = t;
                        } else {
                            //console.log('cantfind');
                        }
                    }
                }
            } else {
                //console.log('cant fit');
            }
        }
    }
    pop(x: number, y: number) {
        if (x > -1 && y > -1 && x < this.getSize.x() && y < this.getSize.y()) {
            let index = this._map[y][x].pop();
            if (index) {
                this._heightmap[y][x].stackingHeight -= this._tileset.subTiles.get(index.tileIndex).properties.cellHeight;
                this._heightmap[y][x].tileHeight--;
                if (this._heightmap[y][x].tileHeight > 0) {
                    this._heightmap[y][x].topTile = this._tileset.subTiles.get(
                        this._map[y][x][this._heightmap[y][x]._tileHeight].tileIndex
                    );
                } else {
                    this._heightmap[y][x].topTile = null;
                }
                return index;
            } else {
                return null;
            }
        }           
    }

    calculateHeightMap() {
        for (let y = 0; y < this._properties.ySize; y++) {
            for (let x = 0; x < this._properties.xSize; x++) {
                let stack = this.getCell(x, y);
                let stackingHeight = 0;
                for (var tile of stack) {
                    stackingHeight += this._tileset.subTiles.get(tile.tileIndex).properties.cellHeight;
                }
                this._heightmap[y][x].stackingHeight = stackingHeight;
                this._heightmap[y][x].tileHeight = stack.length;
                this._heightmap[y][x].topTile = this._tileset.subTiles.get(tile.tileIndex);
            }
        }
    }

    static generateRandomMap(xSize: number, ySize: number, maxHeight: number, tileset: IsoTileSet) {
        let map = new GameMap(xSize,ySize,tileset);
        let height = 0;
        for (let y = 0; y < ySize; y++) {
            for (let x = 0; x < xSize; x++) {
                height = 1 + Math.floor(Math.random()*maxHeight);
                for (let h = 0; h < height; h++) {
                    let tile = tileset.tiles.get(Math.floor(Math.random()*tileset.tiles.getLength()));
                    map.push(x, y, tile);
                    if (tile.properties.canStack == false) {
                        break;
                    }
                }
            }
        }
        return map;
    }
}