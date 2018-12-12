import { IsoTile } from '../isotile';
import { IsoCanvas } from '../isocanvas';
import { GameMap } from '../gamemap';
import { MapeditorComponent } from 'src/app/components/mapeditor/mapeditor.component';

export interface MapEdTool {

    icon: IsoTile;
    properties: any;

    mouseClickListener: (event) => void;
    mouseMoveListener: (event) => void;
    mouseWheelListener: (event) => void;
    mouseDownListener: (event) => void;
    mouseUpListener: (event) => void;
}

export class HandTool implements MapEdTool {
    icon: IsoTile;
    properties = {}
    isoCanvas: IsoCanvas;
    constructor(isoCanvas: IsoCanvas, icon: IsoTile) {
        this.icon = icon;
        this.isoCanvas = isoCanvas;
    }
    mouseClickListener(ev) {
        this.isoCanvas.eventListeners.defaultMouseClickListener(ev);
        this.isoCanvas.drawing.paint();
    }
    mouseMoveListener(ev) {
        //this.isoCanvas.eventListeners.defaultMouseMoveListener(ev);
    }
    mouseWheelListener(ev) {
        this.isoCanvas.eventListeners.defaultMouseWheelListener(ev);
        this.isoCanvas.drawing.paint();
    }
    mouseDownListener(ev) {}
    mouseUpListener(ev) {}
}
export class BrushTool implements MapEdTool {
    icon: IsoTile;
    properties = {
        'exactTile': true
    }
    delegateMapEditor: MapeditorComponent;
    prevCell = {'x': -1, 'y': -1};
    mousedown = false;
    
    constructor(delegateMapEditor: MapeditorComponent, icon: IsoTile) {
        this.icon = icon;
        this.delegateMapEditor = delegateMapEditor;
    }
    mouseClickListener(ev) {}
    mouseMoveListener(ev) {
        if (this.mousedown) {
            let cell = {
                'x': this.delegateMapEditor.myCanvas.mouse.getTileCell().x,
                'y': this.delegateMapEditor.myCanvas.mouse.getTileCell().y
            }
            if (this.prevCell.x != cell.x || this.prevCell.y != cell.y) {
                this.prevCell.x = cell.x;
                this.prevCell.y = cell.y;
                
                let tile = this.delegateMapEditor.selectedTile;
                if (!this.properties.exactTile) {
                    let index = this.delegateMapEditor.myTileset._isoTiles.indexOf(tile);
                    let q = Math.floor(index / 4);
                    tile = this.delegateMapEditor.myTileset._isoTiles[4*q + Math.floor(Math.random()*4)];
                }
                this.delegateMapEditor.myMap.push(
                    this.delegateMapEditor.myCanvas.mouse.getTileCell().x,
                    this.delegateMapEditor.myCanvas.mouse.getTileCell().y,
                    tile
                );
                this.delegateMapEditor.myCanvas.drawing.paint();
            }
        }
    }
    mouseWheelListener(ev) {
        this.delegateMapEditor.myCanvas.eventListeners.defaultMouseWheelListener(ev);
        this.delegateMapEditor.myCanvas.drawing.paint();
    }
    
    mouseDownListener(ev) {

        this.mousedown = true;
        this.prevCell.x = this.delegateMapEditor.myCanvas.mouse.getTileCell().x;
        this.prevCell.y = this.delegateMapEditor.myCanvas.mouse.getTileCell().y;

        let tile = this.delegateMapEditor.selectedTile;
        if (!this.properties.exactTile) {
            let index = this.delegateMapEditor.myTileset._isoTiles.indexOf(tile);
            let q = Math.floor(index / 4);
            tile = this.delegateMapEditor.myTileset._isoTiles[4*q + Math.floor(Math.random()*4)];
        }
        this.delegateMapEditor.myMap.push(
            this.delegateMapEditor.myCanvas.mouse.getTileCell().x,
            this.delegateMapEditor.myCanvas.mouse.getTileCell().y,
            tile
        );
        this.delegateMapEditor.myCanvas.drawing.paint();
    }
    mouseUpListener(ev) {
        this.mousedown = false;
    }
}

export class LineTool implements MapEdTool {
    icon: IsoTile;
    properties = {
        'exactTile': true
    }
    delegateMapEditor: MapeditorComponent;
    p0 = {'x': -1, 'y': -1};
    prevCell = {'x': -1, 'y': -1};
    mousedown = false;

    constructor(delegateMapEditor: MapeditorComponent, icon: IsoTile) {
        this.icon = icon;
        this.delegateMapEditor = delegateMapEditor;
    }
    mouseClickListener(ev) {}
    mouseMoveListener(ev) {
        if (this.mousedown) {
            let x = this.delegateMapEditor.myCanvas.mouse.getTileCell().x;
            let y = this.delegateMapEditor.myCanvas.mouse.getTileCell().y;
            if (this.prevCell.x != x || this.prevCell.y != y) {
                this.delegateMapEditor.myCanvas.gameAssets.cells.clearHighlightedCells();
                // find major axis
                if (Math.abs(x - this.p0.x) > Math.abs(y - this.p0.y)) {
                    let slope = (y - this.p0.y) / (x - this.p0.x);
                    for (let cellX = 0; Math.abs(cellX) < Math.abs(x - this.p0.x); cellX += Math.sign(x - this.p0.x)) {
                        let cellY = Math.round(cellX * slope);
                        this.delegateMapEditor.myCanvas.gameAssets.cells.highlightCell(cellX + this.p0.x, cellY + this.p0.y);
                    }
                } else {
                    let slope = (x - this.p0.x) /(y - this.p0.y);
                    for (let cellY = 0; Math.abs(cellY) < Math.abs(y - this.p0.y); cellY += Math.sign(y - this.p0.y)) {
                        let cellX = Math.round(cellY * slope);
                        this.delegateMapEditor.myCanvas.gameAssets.cells.highlightCell(cellX + this.p0.x, cellY + this.p0.y);
                    }
                }
                this.delegateMapEditor.myCanvas.drawing.paint();
            }
        }
    }
    mouseWheelListener(ev) {
        this.delegateMapEditor.myCanvas.eventListeners.defaultMouseWheelListener(ev);
        this.delegateMapEditor.myCanvas.drawing.paint();
    }
    mouseDownListener(ev) {
        this.mousedown = true;
        let x = this.delegateMapEditor.myCanvas.mouse.getTileCell().x;
        let y = this.delegateMapEditor.myCanvas.mouse.getTileCell().y;
        this.p0.x = x;
        this.p0.y = y;
        this.prevCell.x = x;
        this.prevCell.y = y;
        this.delegateMapEditor.myCanvas.gameAssets.cells.highlightCell(x, y);
        this.delegateMapEditor.myCanvas.drawing.paint();
    }
    mouseUpListener(ev) {
        this.mousedown = false;
        this.delegateMapEditor.myCanvas.gameAssets.cells.forEach((cell: {'x': number, 'y': number}) => {
            let tile = this.delegateMapEditor.selectedTile;
            if (!this.properties.exactTile) {
                let index = this.delegateMapEditor.myTileset._isoTiles.indexOf(tile);
                let q = Math.floor(index / 4);
                tile = this.delegateMapEditor.myTileset._isoTiles[4*q + Math.floor(Math.random()*4)];
            }
            this.delegateMapEditor.myMap.push(cell.x, cell.y, tile);
        });
        this.delegateMapEditor.myCanvas.gameAssets.cells.clearHighlightedCells();
        this.delegateMapEditor.myCanvas.drawing.paint();
    }
}

export class BoxTool implements MapEdTool {
    icon: IsoTile;
    properties = {
        'exactTile': true,
        'fill': false
    }
    delegateMapEditor: MapeditorComponent;
    p0 = {'x': -1, 'y': -1};
    prevCell = {'x': -1, 'y': -1};
    mousedown = false;

    constructor(delegateMapEditor: MapeditorComponent, icon: IsoTile) {
        this.icon = icon;
        this.delegateMapEditor = delegateMapEditor;
    }
    mouseClickListener(ev) {}
    mouseMoveListener(ev) {
        if (this.mousedown) {
            let x = this.delegateMapEditor.myCanvas.mouse.getTileCell().x;
            let y = this.delegateMapEditor.myCanvas.mouse.getTileCell().y;
            if (this.prevCell.x != x || this.prevCell.y != y) {
                this.delegateMapEditor.myCanvas.gameAssets.cells.clearHighlightedCells();
                for (let cellY = 0; Math.abs(cellY) < Math.abs(y - this.p0.y); cellY += Math.sign(y - this.p0.y)) {
                    for (let cellX = 0; Math.abs(cellX) < Math.abs(x - this.p0.x); cellX += Math.sign(x - this.p0.x)) {
                        this.delegateMapEditor.myCanvas.gameAssets.cells.highlightCell(cellX + this.p0.x, cellY + this.p0.y);
                    }
                }
            }
        }
    }
    mouseWheelListener(ev) {
        this.delegateMapEditor.myCanvas.eventListeners.defaultMouseWheelListener(ev);
        this.delegateMapEditor.myCanvas.drawing.paint();
    }
    mouseDownListener(ev) {
        this.mousedown = true;
        let x = this.delegateMapEditor.myCanvas.mouse.getTileCell().x;
        let y = this.delegateMapEditor.myCanvas.mouse.getTileCell().y;
        this.p0.x = x;
        this.p0.y = y;
        this.prevCell.x = x;
        this.prevCell.y = y;
        this.delegateMapEditor.myCanvas.gameAssets.cells.highlightCell(x, y);
        this.delegateMapEditor.myCanvas.drawing.paint();
    }
    mouseUpListener(ev) {
        this.mousedown = false;
        this.delegateMapEditor.myCanvas.gameAssets.cells.forEach((cell: {'x': number, 'y': number}) => {
            let tile = this.delegateMapEditor.selectedTile;
            if (!this.properties.exactTile) {
                let index = this.delegateMapEditor.myTileset._isoTiles.indexOf(tile);
                let q = Math.floor(index / 4);
                tile = this.delegateMapEditor.myTileset._isoTiles[4*q + Math.floor(Math.random()*4)];
            }
            this.delegateMapEditor.myMap.push(cell.x, cell.y, tile);
        });
        this.delegateMapEditor.myCanvas.gameAssets.cells.clearHighlightedCells();
        this.delegateMapEditor.myCanvas.drawing.paint();
    }
}

export class BucketTool implements MapEdTool {
    icon: IsoTile;
    delegateMapEditor: MapeditorComponent;
    properties = {
        'exactTile': true
    }
    floodHeight: number;

    constructor(delegateMapEditor: MapeditorComponent, icon: IsoTile) {
        this.icon = icon;
        this.delegateMapEditor = delegateMapEditor;
    }
    mouseClickListener(ev) {
        this.floodHeight = this.delegateMapEditor.myMap.getCellStackingHeight(
            this.delegateMapEditor.myCanvas.mouse.getTileCell().x,
            this.delegateMapEditor.myCanvas.mouse.getTileCell().y,
        );
        if (this.floodHeight || this.floodHeight === 0) {
            this.flood(
                this.delegateMapEditor.myCanvas.mouse.getTileCell().x,
                this.delegateMapEditor.myCanvas.mouse.getTileCell().y,
            )
            this.delegateMapEditor.myCanvas.drawing.paint();
        }
    }
    mouseMoveListener(ev) {
        //this.isoCanvas.eventListeners.defaultMouseMoveListener(ev);
    }
    mouseWheelListener(ev) {
        this.delegateMapEditor.myCanvas.eventListeners.defaultMouseWheelListener(ev);
        this.delegateMapEditor.myCanvas.drawing.paint();
    }

    flood(x: number, y: number) {
        let height = this.delegateMapEditor.myMap.getCellTileHeight(x, y);
        if (height == this.floodHeight) {
            
            let tile = this.delegateMapEditor.selectedTile;
            if (!this.properties.exactTile) {
                let index = this.delegateMapEditor.myTileset._isoTiles.indexOf(tile);
                let q = Math.floor(index / 4);
                tile = this.delegateMapEditor.myTileset._isoTiles[4*q + Math.floor(Math.random()*4)];
            }
            this.delegateMapEditor.myMap.push(
                x, y,
                tile
            );
            this.flood(x+1,y);
            this.flood(x,y+1); 
            this.flood(x-1,y); 
            this.flood(x,y-1);
        }
    }
    
    mouseDownListener(ev) {}
    mouseUpListener(ev) {}
}

export class EraserTool implements MapEdTool {
    icon: IsoTile;
    properties = {}
    delegateMapEditor: MapeditorComponent;
    
    constructor(delegateMapEditor: MapeditorComponent, icon: IsoTile) {
        this.icon = icon;
        this.delegateMapEditor = delegateMapEditor;
    }
    mouseClickListener(ev) {
        this.delegateMapEditor.myMap.pop(
            this.delegateMapEditor.myCanvas.mouse.getTileCell().x,
            this.delegateMapEditor.myCanvas.mouse.getTileCell().y
        );
        this.delegateMapEditor.myCanvas.drawing.paint();
    }
    mouseMoveListener(ev) {
        //this.delegateMapEditor.myCanvas.eventListeners.defaultMouseMoveListener(ev);
    }
    mouseWheelListener(ev) {
        this.delegateMapEditor.myCanvas.eventListeners.defaultMouseWheelListener(ev);
        this.delegateMapEditor.myCanvas.drawing.paint();
    }
    
    mouseDownListener(ev) {}
    mouseUpListener(ev) {}
}
