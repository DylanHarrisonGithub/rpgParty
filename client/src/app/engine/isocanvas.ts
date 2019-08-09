import { IsoTile } from './isotile';
import { IsoTileSet } from './isotileset';
import { GameMap } from './gamemap';
import { ActorMap } from './actormap';
import { Actor } from './actor';
export class IsoCanvas {

    public axesColor = '#000000';
    public gridColor = '#A0A0C0';
    public backgroundColor = '#ffffff';   
    public showAxes = true;
    public showGrid = true;
    private _div: HTMLDivElement;
    private _canvas: HTMLCanvasElement;
    private _position = {
        'location': {'x': 0, 'y': 0},
        'isoLocation': {'x': 0, 'y': 0},
        'cellLocation': {'x': 0, 'y': 0},
        'zoom': 1.0,
        'zoomInverse': 1.0,
        'rotation': 0
    };
    private _mouse = {
        'canvas': {'x': 0, 'y': 0},
        'cartesian': {'x': 0, 'y': 0},
        'iso': {'x': 0, 'y': 0},
        'cell': {'x': 0, 'y': 0},
        'tileCell': {'x': 0, 'y': 0}
    };
    private _gameAssets = { //should be private
        'map': null,          // should be its own object
        'actormap': null,
        'tileset': null,
        'tileSets': [],
        'hightlightedCells': []
    };
    private _metrics = {
        'cellSize': {'x': 64, 'y': 32}, // = 1/2 cell (width, height)
        'doubleCellSizeInverse': {'x': 1.0 /(2*64), 'y': 1.0 /(2*32)},
        'canvasTileSize': {'x': 64, 'y': 32},
        'halfResolution':  {'x': 0, 'y': 0},
        'relativeIsoRotationDirections': [
            [ {'x': 1, 'y': -1}, {'x': 0, 'y': -1}, {'x': -1, 'y': -1}, {'x': -1, 'y': 0}, {'x': -1, 'y': 1}, {'x': 0, 'y': 1}, {'x': 1, 'y': 1}, {'x': 1, 'y': 0} ],
            [ {'x': 1, 'y': 1}, {'x': 1, 'y': 0}, {'x': 1, 'y': -1}, {'x': 0, 'y': -1}, {'x': -1, 'y': -1}, {'x': -1, 'y': 0}, {'x': -1, 'y': 1}, {'x': 0, 'y': 1} ],
            [ {'x': -1, 'y': 1}, {'x': 0, 'y': 1}, {'x': 1, 'y': 1}, {'x': 1, 'y': 0}, {'x': 1, 'y': -1}, {'x': 0, 'y': -1}, {'x': -1, 'y': -1}, {'x': -1, 'y': 0} ],
            [ {'x': -1, 'y': -1}, {'x': -1, 'y': 0}, {'x': -1, 'y': 1}, {'x': 0, 'y': 1}, {'x': 1, 'y': 1}, {'x': 1, 'y': 0}, {'x': 1, 'y': -1}, {'x': 0, 'y': -1} ]
        ]
    };

    constructor(delagateDiv: HTMLDivElement, gameMap: GameMap, actorMap: ActorMap) {

        this._div = delagateDiv;
        this._canvas = document.createElement('canvas');
        this._div.append(this._canvas);
        this._canvas.width = this._div.clientWidth;
        this._canvas.height = this._div.clientHeight;
        this._metrics.halfResolution.x = this._canvas.width / 2;
        this._metrics.halfResolution.y = this._canvas.height / 2;

        var size1 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
            'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].x, 
            'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].y
        }));
        var size2 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
            'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].x, 
            'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].y
        }));
        var size3 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
            'x': 0, 
            'y': 0
        }));
        var size4 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
            'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].x, 
            'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].y
        }));
        this._metrics.canvasTileSize.x = size2.x - size1.x;
        this._metrics.canvasTileSize.y = size4.y - size3.y;

        // dummy invisible tiles for filler spaces
        //this._gameAssets.tiles.push(new isoTile.IsoTile(null, {isHidden: true, canStack: false}));
        //this._gameAssets.tiles.push(new isoTile.IsoTile(null, {isHidden: true}));

        this._div.addEventListener('mousemove', (ev: UIEvent) => {this.eventListeners.defaultMouseMoveListener(ev)});

        window.addEventListener('resize', (ev: UIEvent) => {
            this.eventListeners.defaultWindowResizeListner(ev);
        });

        this._gameAssets.map = gameMap;
        this._gameAssets.actormap = actorMap;
        
    }

    public gameAssets = {
        getMap: () => { return this._gameAssets.map; },
        setMap: (map: GameMap) => { this._gameAssets.map = map },
        tileset: {
            set: (tset: IsoTileSet) => {
                this._gameAssets.tileset = tset;
            }
        },
        cells: {
            highlightCell: (x: number, y: number) => {
                if (this._gameAssets.hightlightedCells.filter(cell => cell.x == x && cell.y == y).length == 0) {
                    this._gameAssets.hightlightedCells.push({
                        'x': x,
                        'y': y
                    });
                }
            },
            clearHighlightedCells: () => { this._gameAssets.hightlightedCells = []; },
            forEach: (f:(cell: {'x': number, 'y': number}) => any) => { 
                for (let cell of this._gameAssets.hightlightedCells) {
                    f(cell);
                }
            }
        }
    }

    public position = {
        'get': () => {return this._position;},
        'getLocation': () => {return this._position.location;},
        'getZoom': () => {return this._position.zoom;},
        'getZoomInverse': () => {return this._position.zoomInverse;},
        'getRotation': () => {return this._position.rotation;},
        'setLocation': (cartesianCoord:  {'x': number, 'y': number}) => {
            this._position.location.x = cartesianCoord.x;
            this._position.location.y = cartesianCoord.y;
            this._position.isoLocation = this.transformations.cartesianToIso(this._position.location);
            this._position.cellLocation = {
                'x': Math.floor(this._position.isoLocation.x),
                'y': Math.floor(this._position.isoLocation.y)
            }
        },
        'setIsoLocation': (isoCoord:  {'x': number, 'y': number}) => {
            this._position.isoLocation.x = isoCoord.x;
            this._position.isoLocation.y = isoCoord.y;
            this._position.location = this.transformations.isoToCartesian(this._position.isoLocation);
            this._position.cellLocation = {
                'x': Math.floor(this._position.isoLocation.x),
                'y': Math.floor(this._position.isoLocation.y)
            }
        },
        'setCellLocation': (cellCoord: {'x': number, 'y': number}) => {
            this._position.isoLocation = {
                'x': Math.floor(cellCoord.x) + 0.5, //center of cell
                'y': Math.floor(cellCoord.y) + 0.5
            }
            this._position.cellLocation = {
                'x': Math.floor(cellCoord.x),
                'y': Math.floor(cellCoord.y)
            }
            this._position.location = this.transformations.isoToCartesian(this._position.isoLocation);
        },
        'zoom': (z: number) => {this.transformations.zoom(z);},
        'setZoom:': (z: number) => {this.transformations.setZoom(z);},
        'rotate': (r: number) => {this.transformations.rotate(r);},
        'setRotation:': (r: number) => {this.transformations.setRotation(r);}
    };
    public mouse = {
        'get': () => {return this._mouse;},
        'getCanvas': () => {return this._mouse.canvas;},
        'getCartesian': () => {return this._mouse.cartesian;},
        'getIso': () => {return this._mouse.iso;},
        'getCell': () => {return this._mouse.cell;},
        'getTileCell': () => {return this._mouse.tileCell;},
        'calcTileCell': (canCoord: {x: number, y: number}) => {
            let startCellIso = this.transformations.canvasToIso(canCoord);
            let startCell = {
                'x': Math.floor(startCellIso.x),
                'y': Math.floor(startCellIso.y)
            }
            let offset = {
                'x': startCellIso.x - startCell.x,
                'y': startCellIso.y - startCell.y
            }
            let tileCell = {
                'x': startCell.x,
                'y': startCell.y
            }
            let t = 0;
            for (let n = 0; n < 5; n++) {

                let x = n + (offset.x) - (<GameMap>this._gameAssets.map).getCellStackingHeight(startCell.x, startCell.y);
                let y = n + (offset.y) - (<GameMap>this._gameAssets.map).getCellStackingHeight(startCell.x, startCell.y); 
                
                if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
                    tileCell.x = startCell.x;
                    tileCell.y = startCell.y;
                }
                startCell.x += this._metrics.relativeIsoRotationDirections[this._position.rotation][6].x;
                startCell.y += this._metrics.relativeIsoRotationDirections[this._position.rotation][6].y;
            }
            return tileCell;

        }
    };
    public transformations = {
        'isoToCartesian': (isoCoord: {'x': number, 'y': number}) => {
            switch (this._position.rotation) {
                case 0: {            
                    return {
                        'x': this._metrics.cellSize.x*(isoCoord.x - isoCoord.y),
                        'y': -this._metrics.cellSize.y*(isoCoord.x + isoCoord.y)
                    }
                }
                case 1: {
                    return {
                        'x': this._metrics.cellSize.x*(isoCoord.x + isoCoord.y),
                        'y': this._metrics.cellSize.y*(isoCoord.x - isoCoord.y)
                    }
                }
                case 2: {           
                    return {
                        'x': this._metrics.cellSize.x*(-isoCoord.x + isoCoord.y),
                        'y': this._metrics.cellSize.y*(isoCoord.x + isoCoord.y)
                    }
                }
                default: {
                    return {
                        'x': -this._metrics.cellSize.x*(isoCoord.x + isoCoord.y),
                        'y': this._metrics.cellSize.y*(-isoCoord.x + isoCoord.y)
                    }
                }            
            }
        },
        'cartesianToIso': (cartesianCoord:  {'x': number, 'y': number}) => {
            switch (this._position.rotation) {
                case 0: {                  
                    return {
                        'x': this._metrics.doubleCellSizeInverse.x*cartesianCoord.x - this._metrics.doubleCellSizeInverse.y*cartesianCoord.y,
                        'y': -(this._metrics.doubleCellSizeInverse.x*cartesianCoord.x + this._metrics.doubleCellSizeInverse.y*cartesianCoord.y)
                    };
                }
                case 1: {
                    return {
                        'x': this._metrics.doubleCellSizeInverse.x*cartesianCoord.x + this._metrics.doubleCellSizeInverse.y*cartesianCoord.y,
                        'y': this._metrics.doubleCellSizeInverse.x*cartesianCoord.x - this._metrics.doubleCellSizeInverse.y*cartesianCoord.y
                    };
                }
                case 2: {
                    return {
                        'x': -this._metrics.doubleCellSizeInverse.x*cartesianCoord.x + this._metrics.doubleCellSizeInverse.y*cartesianCoord.y,
                        'y': this._metrics.doubleCellSizeInverse.x*cartesianCoord.x + this._metrics.doubleCellSizeInverse.y*cartesianCoord.y
                    };
                }
                default: {
                    return {
                        'x': -this._metrics.doubleCellSizeInverse.x*cartesianCoord.x - this._metrics.doubleCellSizeInverse.y*cartesianCoord.y,
                        'y': -this._metrics.doubleCellSizeInverse.x*cartesianCoord.x + this._metrics.doubleCellSizeInverse.y*cartesianCoord.y
                    };
                }            
            }
        },
        'cartesianToCanvas': (cartesianCoord: {'x': number, 'y': number}) => {
            return {
                'x': (cartesianCoord.x - this._position.location.x)*this._position.zoom + this._canvas.width / 2,
                'y': -(cartesianCoord.y - this._position.location.y)*this._position.zoom + this._canvas.height / 2
            };
        },
        'canvasToCartesian': (screenCoordinate: {'x': number, 'y': number}) => {
            return {
                'x': (screenCoordinate.x - this._metrics.halfResolution.x)*this._position.zoomInverse + this._position.location.x,
                'y': -(screenCoordinate.y - this._metrics.halfResolution.y)*this._position.zoomInverse + this._position.location.y
            };
        },
        'isoToCanvas': (isoCoord: {'x': number, 'y': number}) => {            
            return this.transformations.cartesianToCanvas(
                this.transformations.isoToCartesian(isoCoord)
            );
        },
        'canvasToIso': (canvasCoord: {'x': number, 'y': number}) => {                
            return this.transformations.cartesianToIso(
                this.transformations.canvasToCartesian(canvasCoord)
            );
        },
        'rotate': (r: number) => {
            let isoLoc = this.transformations.cartesianToIso(this._position.location);
            this._position.rotation = (((this._position.rotation + Math.floor(r) % 4)) + 4) % 4;
            var size1 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].x, 
                'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].y
            }));
            var size2 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].x, 
                'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].y
            }));
            var size3 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': 0, 
                'y': 0
            }));
            var size4 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].x, 
                'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].y
            }));
            this._metrics.canvasTileSize.x = size2.x - size1.x;
            this._metrics.canvasTileSize.y = size4.y - size3.y;
            this._position.location = this.transformations.isoToCartesian(isoLoc);
        },
        'setRotation': (r: number) => {
            let isoLoc = this.transformations.cartesianToIso(this._position.location);
            this._position.rotation = ((Math.floor(r) % 4) + 4) % 4;
            var size1 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].x, 
                'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].y
            }));
            var size2 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].x, 
                'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].y
            }));
            var size3 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': 0, 
                'y': 0
            }));
            var size4 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].x, 
                'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].y
            }));
            this._metrics.canvasTileSize.x = size2.x - size1.x;
            this._metrics.canvasTileSize.y = size4.y - size3.y;
            this._position.location = this.transformations.isoToCartesian(isoLoc);
        },
        'zoom': (z: number) => {
            if (z > 0) {
                this._position.zoom = this._position.zoom*z;
                this._position.zoomInverse = 1.0/this._position.zoom;
                
                var size1 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                    'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].x, 
                    'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].y
                }));
                var size2 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                    'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].x, 
                    'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].y
                }));
                var size3 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                    'x': 0, 
                    'y': 0
                }));
                var size4 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                    'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].x, 
                    'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].y
                }));
                this._metrics.canvasTileSize.x = size2.x - size1.x;
                this._metrics.canvasTileSize.y = size4.y - size3.y;
            }
        },
        'setZoom': (z: number) => {
            if (z > 0) {
                this._position.zoom = z;
                this._position.zoomInverse = 1.0/this._position.zoom;
                
                var size1 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                    'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].x, 
                    'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].y
                }));
                var size2 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                    'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].x, 
                    'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].y
                }));
                var size3 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                    'x': 0, 
                    'y': 0
                }));
                var size4 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                    'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].x, 
                    'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].y
                }));
                this._metrics.canvasTileSize.x = size2.x - size1.x;
                this._metrics.canvasTileSize.y = size4.y - size3.y;
            }
        }
    };

    // Drawing
    public drawing = {
        'clearCanvas': (ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0,0,this._canvas.width,this._canvas.height);
        },
        'highlightCell': (isoCoord: {'x': number, 'y': number}, ctx: CanvasRenderingContext2D) => {
            let a = this.transformations.isoToCanvas({
                'x': isoCoord.x,
                'y': isoCoord.y
            });
            let b = this.transformations.isoToCanvas({           
                'x': isoCoord.x + 1,
                'y': isoCoord.y
            });
            let c = this.transformations.isoToCanvas({
                'x': isoCoord.x + 1,
                'y': isoCoord.y + 1
            });
            let d = this.transformations.isoToCanvas({
                'x': isoCoord.x,
                'y': isoCoord.y + 1
            });
    
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.lineTo(d.x, d.y);
            ctx.closePath();
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();        
        },
        'drawIsoTile':(isoCoord:  {'x': number, 'y': number}, tile: IsoTile, ctx: CanvasRenderingContext2D) => {

            if (tile && tile.image && !tile.properties.isHidden) {

                let topLeft = this.transformations.isoToCanvas({
                    'x': isoCoord.x + 0.5 +
                        tile.properties.cellHeight*(this._metrics.relativeIsoRotationDirections[this._position.rotation][2].x) +
                        this._metrics.relativeIsoRotationDirections[this._position.rotation][3].x,
                    'y': isoCoord.y + 0.5 +
                        tile.properties.cellHeight*(this._metrics.relativeIsoRotationDirections[this._position.rotation][2].y) +
                        this._metrics.relativeIsoRotationDirections[this._position.rotation][3].y
                });

                ctx.drawImage(
                    tile.image,
                    tile.properties.subImageX, tile.properties.subImageY, tile.properties.subImageWidth, tile.properties.subImageHeight,
                    topLeft.x, topLeft.y,
                    this._metrics.canvasTileSize.x, (1 + tile.properties.cellHeight)*this._metrics.canvasTileSize.y
                );
            }
        },
        'drawIsoTileAlpha':(isoCoord:  {'x': number, 'y': number}, tile: IsoTile, ctx: CanvasRenderingContext2D, alpha: number) => {

            if (tile && tile.image && !tile.properties.isHidden) {

                let topLeft = this.transformations.isoToCanvas({
                    'x': isoCoord.x + 0.5 +
                        tile.properties.cellHeight*(this._metrics.relativeIsoRotationDirections[this._position.rotation][2].x) +
                        this._metrics.relativeIsoRotationDirections[this._position.rotation][3].x,
                    'y': isoCoord.y + 0.5 +
                        tile.properties.cellHeight*(this._metrics.relativeIsoRotationDirections[this._position.rotation][2].y) +
                        this._metrics.relativeIsoRotationDirections[this._position.rotation][3].y
                });
                ctx.globalAlpha = alpha;
                ctx.drawImage(
                    tile.image,
                    tile.properties.subImageX, tile.properties.subImageY, tile.properties.subImageWidth, tile.properties.subImageHeight,
                    topLeft.x, topLeft.y,
                    this._metrics.canvasTileSize.x, (1 + tile.properties.cellHeight)*this._metrics.canvasTileSize.y
                );
                ctx.globalAlpha = 1.0;
            }
        },
        'drawCellStack': (x: number, y: number, minHeigt: number, ctx: CanvasRenderingContext2D) => {
            var stackingHeight = 0;
            let cell = this._gameAssets.map.getCell(x, y);
            for (var level = 0; level < cell.length; level++) {
                // todo: detect if tile is visible or obscured to speed up drawing

                let subTile = (<IsoTileSet>this._gameAssets.tileset).subTiles.get(cell[level]);
                let parent = subTile.parent;
                let index = (<IsoTileSet>this._gameAssets.tileset).tiles.indexOf(parent);
                let q = Math.floor(index / 4);
                let r = ((index % 4) + this._position.rotation) % 4;
                let rotatedParent = (<IsoTileSet>this._gameAssets.tileset).tiles.get(4*q + r);
                let rotatedSubTile = rotatedParent.getSubtile(
                    subTile.subCoord.x,
                    subTile.subCoord.y,
                    this._position.rotation
                );
                if (stackingHeight + rotatedSubTile.properties.cellHeight > minHeigt) {
                    this.drawing.drawIsoTile({
                        'x': x + this._metrics.relativeIsoRotationDirections[this._position.rotation][2].x*stackingHeight,
                        'y': y + this._metrics.relativeIsoRotationDirections[this._position.rotation][2].y*stackingHeight   
                    }, rotatedSubTile, ctx);
                }
                stackingHeight += rotatedSubTile.properties.cellHeight;
            }
        },
        'drawIsoTilesWithinCanvasFrame': (ctx: CanvasRenderingContext2D) => {

            // get isometric coordinates of canvas boundary corners
            // a----b
            // |    |
            // d----c
            var a = this.transformations.canvasToIso({"x": 0, "y": 0});
            var c = this.transformations.canvasToIso({"x": this._canvas.width, "y": this._canvas.height});

            a.x = Math.floor(a.x) + this._metrics.relativeIsoRotationDirections[this._position.rotation][3].x;
            a.y = Math.floor(a.y) + this._metrics.relativeIsoRotationDirections[this._position.rotation][3].y;
            c.x = Math.floor(c.x) + this._metrics.relativeIsoRotationDirections[this._position.rotation][7].x;
            c.y = Math.floor(c.y) + this._metrics.relativeIsoRotationDirections[this._position.rotation][7].y;            
            c.x += 2*this._metrics.relativeIsoRotationDirections[this._position.rotation][6].x;
            c.y += 2*this._metrics.relativeIsoRotationDirections[this._position.rotation][6].y;

            //sum must be even to form perfect rectangle in Z^2
            if (Math.abs(a.x + a.y + c.x + c.y) % 2 == 1) {
                c.x += this._metrics.relativeIsoRotationDirections[this._position.rotation][7].x;
                c.y += this._metrics.relativeIsoRotationDirections[this._position.rotation][7].y;
            }
            
            // determine corners b, d from a, c 
            let b, d;
            if ((this._position.rotation % 2) == 0) {
                b = {'x': (a.x+a.y+c.x-c.y)/2, 'y': (a.x+a.y-c.x+c.y)/2 };
                d = {'x': (a.x-a.y+c.x+c.y)/2, 'y': (-a.x+a.y+c.x+c.y)/2 };
            } else {
                b = {'x': (a.x-a.y+c.x+c.y)/2, 'y': (-a.x+a.y+c.x+c.y)/2 };
                d = {'x': (a.x+a.y+c.x-c.y)/2, 'y': (a.x+a.y-c.x+c.y)/2 };
            }

            let u = {'x': a.x, 'y': a.y};
            let rowStart = {'x': a.x, 'y': a.y};
            let rowEnd = {
                'x': b.x + this._metrics.relativeIsoRotationDirections[this._position.rotation][0].x, 
                'y': b.y  + this._metrics.relativeIsoRotationDirections[this._position.rotation][0].y
            };
            let terminator = {
                'x': d.x + this._metrics.relativeIsoRotationDirections[this._position.rotation][5].x,
                'y': d.y + this._metrics.relativeIsoRotationDirections[this._position.rotation][5].y,
            };
            let rowCounter = 0;
            
            while ((u.x != terminator.x) && (u.y != terminator.y)) {

                while ((u.x != rowEnd.x) && (u.y != rowEnd.y)) {
                    
                    if ((u.x > -1) && (u.x < this._gameAssets.map.getSize.x()) && (u.y > -1) && (u.y < this._gameAssets.map.getSize.y())) {
                        
                        // draw tiles from ground up
                        this.drawing.drawCellStack(u.x, u.y, -1, ctx);
                        // draw actors
                        if ((<Array<Actor>>this._gameAssets.actormap.getCell(u.x, u.y)).length) {
                            (<Array<Actor>>this._gameAssets.actormap.getCell(u.x, u.y)).forEach(actor => {
                                this.drawing.drawIsoTile({
                                    'x': actor.x + this._metrics.relativeIsoRotationDirections[this._position.rotation][2].x*actor.height,
                                    'y': actor.y + this._metrics.relativeIsoRotationDirections[this._position.rotation][2].y*actor.height
                                }, actor.getCurrentFrame(), ctx);
                            });
                            // redraw adjacent cells from actor height up if they are taller at
                            // (x-1,y),(x,y-1),(x-1,y+1),(x,y), in order, with respect to cursor.
                            //           /a\
                            //         /2\ /3\
                            //       /4\ /c\ /
                            //       \ / \ /
                            let actorHeight = this._gameAssets.map.getCellStackingHeight(u.x-1, u.y-1);
                            if (this._gameAssets.map.getCellStackingHeight(u.x-1, u.y) > actorHeight) {
                                this.drawing.drawCellStack(u.x-1,u.y,actorHeight,ctx);
                            }
                            if (this._gameAssets.map.getCellStackingHeight(u.x, u.y-1) > actorHeight) {
                                this.drawing.drawCellStack(u.x,u.y-1,actorHeight,ctx);
                            }
                            if (this._gameAssets.map.getCellStackingHeight(u.x-1, u.y+1) > actorHeight) {
                                this.drawing.drawCellStack(u.x-1,u.y+1,actorHeight,ctx);
                            }
                            if (this._gameAssets.map.getCellStackingHeight(u.x, u.y) > actorHeight) {
                                this.drawing.drawCellStack(u.x,u.y,actorHeight,ctx);
                            }
                        }
                    } 
                    // move cursor left
                    u.x += this._metrics.relativeIsoRotationDirections[this._position.rotation][0].x;
                    u.y += this._metrics.relativeIsoRotationDirections[this._position.rotation][0].y;
                }
                // proceed downward in zigzag fashion
                // /  \
                // \  /
                // /  \
                // ..
                if (rowCounter % 2 == 1) {
                    rowStart.x += this._metrics.relativeIsoRotationDirections[this._position.rotation][5].x;
                    rowStart.y += this._metrics.relativeIsoRotationDirections[this._position.rotation][5].y;                
                    rowEnd.x += this._metrics.relativeIsoRotationDirections[this._position.rotation][7].x;
                    rowEnd.y += this._metrics.relativeIsoRotationDirections[this._position.rotation][7].y;
                } else {
                    rowStart.x += this._metrics.relativeIsoRotationDirections[this._position.rotation][7].x;
                    rowStart.y += this._metrics.relativeIsoRotationDirections[this._position.rotation][7].y;                
                    rowEnd.x += this._metrics.relativeIsoRotationDirections[this._position.rotation][5].x;
                    rowEnd.y += this._metrics.relativeIsoRotationDirections[this._position.rotation][5].y;
                }
                rowCounter++;
                u = {'x': rowStart.x, 'y': rowStart.y};   // set cursor to next row
            }
        },       
        'drawCartesianAxes': (ctx: CanvasRenderingContext2D) => {

            var northWest = {"x":0, "y":0};
            var southEast = {"x": this._canvas.width, "y": this._canvas.height};
            northWest = this.transformations.canvasToCartesian(northWest);
            southEast = this.transformations.canvasToCartesian(southEast);

            if ((northWest.x <= 0) && (southEast.x >= 0)) {
                
                var topCoord = {"x":0, "y":northWest.y};
                var bottomCoord = {"x":0,"y":southEast.y};
                
                topCoord = this.transformations.cartesianToCanvas(topCoord);
                bottomCoord = this.transformations.cartesianToCanvas(bottomCoord);

                ctx.strokeStyle = this.axesColor;
                ctx.beginPath();
                ctx.moveTo(topCoord.x, topCoord.y);
                ctx.lineTo(bottomCoord.x, bottomCoord.y);
                ctx.stroke();
            }
            if ((northWest.y >= 0) && (southEast.y <= 0)) {
                var leftCoord = {"x":northWest.x, "y":0};
                var rightCoord = {"x":southEast.x, "y":0};

                leftCoord = this.transformations.cartesianToCanvas(leftCoord);
                rightCoord = this.transformations.cartesianToCanvas(rightCoord);

                ctx.strokeStyle = this.axesColor;
                ctx.beginPath();
                ctx.moveTo(leftCoord.x, leftCoord.y);
                ctx.lineTo(rightCoord.x, rightCoord.y);
                ctx.stroke();
            }		
        },
        'drawIsoAxes': (ctx: CanvasRenderingContext2D) => {

            // find where x and y axis intersect canvas boundaries
            var xAxis = this._cartesianGetLineSegmentInCanvasBounds(
                this.transformations.isoToCartesian({'x': 0, 'y': 0}),
                this.transformations.isoToCartesian({'x': 1, 'y': 0})
            );

            var yAxis = this._cartesianGetLineSegmentInCanvasBounds(
                this.transformations.isoToCartesian({'x': 0, 'y': 0}),
                this.transformations.isoToCartesian({'x': 0, 'y': 1})
            );
            
            ctx.strokeStyle = this.axesColor;
            var u, v;
            if (xAxis) {

                u = this.transformations.cartesianToCanvas(xAxis.u);
                v = this.transformations.cartesianToCanvas(xAxis.v);

                ctx.beginPath();
                ctx.moveTo(u.x , u.y);
                ctx.lineTo(v.x, v.y);
                ctx.stroke();
            }

            if (yAxis) {

                u = this.transformations.cartesianToCanvas(yAxis.u);
                v = this.transformations.cartesianToCanvas(yAxis.v);

                ctx.beginPath();
                ctx.moveTo(u.x , u.y);
                ctx.lineTo(v.x, v.y);
                ctx.stroke();
            }
            
        },
        'drawIsoGrid': (ctx: CanvasRenderingContext2D) => {
            // get isometric coordinates of canvas boundary corners
            // a----b
            // |    |
            // d----c
            var a = this.transformations.canvasToIso({"x": 0, "y": 0});
            var b = this.transformations.canvasToIso({'x': this._canvas.width, 'y': 0});
            var c = this.transformations.canvasToIso({"x": this._canvas.width, "y": this._canvas.height});
            var d = this.transformations.canvasToIso({'x': 0, 'y': this._canvas.height});

            a.x = Math.floor(a.x);
            a.y = Math.floor(a.y);
            c.x = Math.floor(c.x) + 1;
            c.y = Math.floor(c.y) + 1;

            b.x = Math.floor(b.x) + 1;
            b.y = Math.floor(b.y);
            d.x = Math.floor(d.x);
            d.y = Math.floor(d.y) + 1;

            ctx.strokeStyle = this.gridColor;
            var uv, u, v;
            let minX = Math.min(a.x, b.x, c.x, d.x);
            let maxX = Math.max(a.x, b.x, c.x, d.x);
            
            let minY = Math.min(a.y, b.y, c.y, d.y);
            let maxY = Math.max(a.y, b.y, c.y, d.y);

            // plot x gridlines
            for (var x = minX; x < maxX; x++) {

                uv = this._cartesianGetLineSegmentInCanvasBounds(
                    this.transformations.isoToCartesian({'x': x, 'y': 0}),
                    this.transformations.isoToCartesian({'x': x, 'y': 1})
                );

                if (uv) {
                    u = this.transformations.cartesianToCanvas(uv.u);
                    v = this.transformations.cartesianToCanvas(uv.v);
                    ctx.beginPath();
                    ctx.moveTo(u.x , u.y);
                    ctx.lineTo(v.x, v.y);
                    ctx.stroke();
                }
            }

            // plot y gridlines
            for (var y = minY; y < maxY; y++) {

                uv = this._cartesianGetLineSegmentInCanvasBounds(
                    this.transformations.isoToCartesian({'x': 0, 'y': y}),
                    this.transformations.isoToCartesian({'x': 1, 'y': y})
                );

                if (uv) {
                    u = this.transformations.cartesianToCanvas(uv.u);
                    v = this.transformations.cartesianToCanvas(uv.v);
                    ctx.beginPath();
                    ctx.moveTo(u.x , u.y);
                    ctx.lineTo(v.x, v.y);
                    ctx.stroke();
                }
            }
        },        
        'paint': () => {
            var ctx = this._canvas.getContext('2d');
            this.drawing.clearCanvas(ctx);

            if (this.showGrid) {
                this.drawing.drawIsoGrid(ctx);
            }

            if (this.showAxes) {
                this.drawing.drawIsoAxes(ctx);
            }

            this.drawing.drawIsoTilesWithinCanvasFrame(ctx);
            this.drawing.highlightCell(this.mouse.getCell(), ctx);
            for (let cell of this._gameAssets.hightlightedCells) {
                this.drawing.highlightCell(cell, ctx);
            }
        },
        'getContext': () => { return this._canvas.getContext('2d'); }
    };

    public eventListeners = {
        'defaultMouseMoveListener': (event) => {
            var centerDivRect = this._div.getBoundingClientRect();
            this._mouse.canvas = {"x": event.clientX-centerDivRect.left, "y": event.clientY-centerDivRect.top};
            this._mouse.cartesian = this.transformations.canvasToCartesian(this._mouse.canvas);
            this._mouse.iso = this.transformations.cartesianToIso(this._mouse.cartesian);        
            if ((this._mouse.cell.x != Math.floor(this._mouse.iso.x)) || (this._mouse.cell.y != Math.floor(this._mouse.iso.y))) {
                this._mouse.cell.x = Math.floor(this._mouse.iso.x);
                this._mouse.cell.y = Math.floor(this._mouse.iso.y);

                this._mouse.tileCell = this.mouse.calcTileCell(this.mouse.getCanvas());
                //this.drawing.paint();
            }
        },
        'defaultMouseWheelListener': (event) => {
            if (event.deltaY < 0) {
                this._position.zoom = this._position.zoom*(1.05);
                this._position.zoomInverse = 1.0/this._position.zoom;
            } else {
                this._position.zoom = this._position.zoom*(0.95);
                this._position.zoomInverse = 1.0/this._position.zoom;			
            }
            
            var size1 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].x, 
                'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][5].y
            }));
            var size2 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].x, 
                'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][7].y
            }));
            var size3 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': 0, 
                'y': 0
            }));
            var size4 = this.transformations.cartesianToCanvas(this.transformations.isoToCartesian({
                'x': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].x, 
                'y': this._metrics.relativeIsoRotationDirections[this._position.rotation][6].y
            }));
            this._metrics.canvasTileSize.x = size2.x - size1.x;
            this._metrics.canvasTileSize.y = size4.y - size3.y;
        },
        'defaultMouseClickListener': (event) => {
            var centerDivRect = this._div.getBoundingClientRect();
            this._mouse.canvas = {"x": event.clientX-centerDivRect.left, "y": event.clientY-centerDivRect.top};
            this._mouse.cartesian = this.transformations.canvasToCartesian(this._mouse.canvas);

            this._position.location.x = this._mouse.cartesian.x;
            this._position.location.y = this._mouse.cartesian.y;
        },
        'defaultWindowResizeListner': (ev: UIEvent) => {
            this._canvas.width = this._div.clientWidth;
            this._canvas.height = this._div.clientHeight;        
            this._metrics.halfResolution.x = this._canvas.width / 2;
            this._metrics.halfResolution.y = this._canvas.height / 2;
        }
    };
    public metrics = {
        'getCanvasTileSize': () => {return this._metrics.canvasTileSize}
    };
    
    // helper methods
    _cartesianGetLineSegmentInCanvasBounds(
        u: {'x': number, 'y': number},
        v: {'x': number, 'y': number}
    ) {

        // get screen boundary corners
        // a----b
        // |    |
        // d----c
        var a = this.transformations.canvasToCartesian({"x": 0, "y": 0});
        var b = this.transformations.canvasToCartesian({'x': this._canvas.width, 'y': 0});
        var c = this.transformations.canvasToCartesian({"x": this._canvas.width, "y": this._canvas.height});
        var d = this.transformations.canvasToCartesian({'x': 0, 'y': this._canvas.height});

        // find where screen boundaries and line uv intersect
        var intersections = [];        
        intersections.push({
            'u': a,
            'v': b,
            't': IsoCanvas._findParametricIntersection(a, b, u, v)
        });
        intersections.push({
            'u': b,
            'v': c,
            't': IsoCanvas._findParametricIntersection(b, c, u, v)
        });
        intersections.push({
            'u': c,
            'v': d,
            't': IsoCanvas._findParametricIntersection(c, d, u, v)
        });
        intersections.push({
            'u': d,
            'v': a,
            't': IsoCanvas._findParametricIntersection(d, a, u, v)
        });

        // ignore intersections that occur off screen and non-intersections
        for (var i = 3; i > -1; i--) {
            if (intersections[i].t) {
                if (intersections[i].t < 0 || intersections[i].t > 1.0) {
                    intersections.splice(i, 1);
                }
            } else {
                intersections.splice(i, 1);
            }
        }

        // return line segment intersecting screen bounds, if any.
        // !!might break if a line intersects in a screen corner??
        if (intersections.length >= 2) {

            var x1 = IsoCanvas._getParametricPoint(
                intersections[0].u,
                intersections[0].v,
                intersections[0].t);

            var x2 = IsoCanvas._getParametricPoint(
                intersections[1].u,
                intersections[1].v,
                intersections[1].t);

            return {'u': x1, 'v': x2};

        } else {
            return null;
        }

    }
    static _findParametricIntersection(
        A1: {'x': number, 'y': number},
        A2: {'x': number, 'y': number},
        B1: {'x': number, 'y': number},
        B2: {'x': number, 'y': number}
    ) {
        var a = {'x': A2.x - A1.x, 'y': A2.y - A1.y};
        var b = {'x': B2.x - B1.x, 'y': B2.y - B1.y};
        var c = {'x': B1.x - A1.x, 'y': B1.y - A1.y};

        var determinant = b.x*a.y - a.x*b.y;

        if (determinant != 0) {
            return (b.x*c.y - c.x*b.y) / determinant;
        } else {
            return null;
        }
    }

    static _getParametricPoint(
        u: {'x': number, 'y': number},
        v: {'x': number, 'y': number},
        t: number
    ) {
        return {'x': u.x + t*(v.x - u.x), 'y': u.y + t*(v.y - u.y)};
    }

}