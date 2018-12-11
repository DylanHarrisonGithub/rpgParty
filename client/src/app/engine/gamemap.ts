import { IsoTile } from './isotile';
import { IsoTileSet } from './isotileset';
export class GameMap {
    
    private _map = [];
    private _heightmap = [];
    private _tileset: IsoTileSet;
    public title = "untitledmap";
    private _properties = {
        tileset: "unset",
        xSize: 0,
        ySize: 0
    }

    constructor(xSize: number, ySize: number, tileset: IsoTileSet) {
        this._tileset = tileset;
        this._properties.tileset = tileset.properties.tileSetName;
        this._properties.xSize = xSize;
        this._properties.ySize = ySize;

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

    getTile(x: number, y: number, z: number) {
        return this._tileset._isoTiles[this._map[y][x][z]];
    }
    getTileIndex(x: number, y: number, z: number) {
        return this._map[y][x][z];
    }
    getCell(x: number, y: number) {
        if (x > -1 && y > -1 && x < this.getSize.x() && y < this.getSize.y()) {
            return this._map[y][x];
        } else {
            return null;
        }
    }

    push(x: number, y: number, tile: IsoTile) {
        let index = this._tileset._isoTiles.indexOf(tile);
        if (index > -1) {
            if (x > -1 && y > -1 && x < this.getSize.x() && y < this.getSize.y()) {
                this._map[y][x].push(index);
                this._heightmap[y][x].stackingHeight += tile.properties.stackingHeight;
                this._heightmap[y][x].tileHeight++;
                this._heightmap[y][x].topTile = tile;
            }
        }
    }
    pop(x: number, y: number) {
        if (x > -1 && y > -1 && x < this.getSize.x() && y < this.getSize.y()) {
            let index = this._map[y][x].pop();
            if (index) {
                this._heightmap[y][x].stackingHeight -= this._tileset._isoTiles[index].properties.stackingHeight;
                this._heightmap[y][x].tileHeight--;
                if (this._heightmap[y][x].tileHeight > 0) {
                    this._heightmap[y][x].topTile = this._tileset._isoTiles[
                        this._map[y][x][this._heightmap[y][x]._tileHeight]
                    ];
                } else {
                    this._heightmap[y][x].topTile = null;
                }
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
                for (var tileIndex of stack) {
                    stackingHeight += this._tileset._isoTiles[tileIndex].properties.stackingHeight;
                }
                this._heightmap[y][x].stackingHeight = stackingHeight;
                this._heightmap[y][x].tileHeight = stack.length;
                this._heightmap[y][x].topTile = this._tileset._isoTiles[tileIndex];
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
                    let tile = tileset._isoTiles[Math.floor(Math.random()*tileset._isoTiles.length)];
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