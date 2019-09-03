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
  mouseMoveListener(ev) {}
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
    let cell = {
      'x': this.delegateMapEditor.myCanvas.mouse.getTileCell().x,
      'y': this.delegateMapEditor.myCanvas.mouse.getTileCell().y
    }
    if (this.prevCell.x != cell.x || this.prevCell.y != cell.y) {
      let tile = this.delegateMapEditor.selectedTile;
      if (!this.properties.exactTile) {
        let index = this.delegateMapEditor.myTileset.tiles.indexOf(tile);
        let q = Math.floor(index / 4);
        tile = this.delegateMapEditor.myTileset.tiles.get(4*q + Math.floor(Math.random()*4));
      }
      if (this.mousedown) {
        this.delegateMapEditor.myMap.push(
          cell.x,
          cell.y,
          tile
        );
      } else {
        let prevCellHeight = this.delegateMapEditor.myMap.getCellTileHeight(this.prevCell.x, this.prevCell.y);
        if (prevCellHeight > 0) {
          let undertile = this.delegateMapEditor.myMap.getCell(this.prevCell.x, this.prevCell.y)[prevCellHeight-1];
          if (undertile.alpha === .751234) {
            this.delegateMapEditor.myMap.pop(this.prevCell.x, this.prevCell.y);
          }
        }
        this.delegateMapEditor.myMap.push(
          cell.x,
          cell.y,
          tile, .751234
        );
      }
      this.delegateMapEditor.myCanvas.drawing.paint();
      this.prevCell.x = cell.x;
      this.prevCell.y = cell.y;
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
    let index = this.delegateMapEditor.myTileset.tiles.indexOf(tile);
    let q = Math.floor(index / 4);
    let r = index % 4;
    r = (r + (4 - this.delegateMapEditor.myCanvas.position.getRotation())) % 4;
    
    if (!this.properties.exactTile) {
      q = Math.floor(index / 4);
      r = Math.floor(Math.random()*4);
    }
    index = 4*q + r;
    tile = this.delegateMapEditor.myTileset.subTiles.get(index);
    let tileCell = this.delegateMapEditor.myCanvas.mouse.getTileCell();
    let cellHeight = this.delegateMapEditor.myMap.getCellTileHeight(tileCell.x, tileCell.y);
    if (cellHeight > 0) {
      let undertile = this.delegateMapEditor.myMap.getCell(tileCell.x, tileCell.y)[cellHeight-1];
      if (undertile.alpha === .751234) {
        this.delegateMapEditor.myMap.pop(tileCell.x, tileCell.y);
      }
    }
    this.delegateMapEditor.myMap.push(
      tileCell.x,
      tileCell.y,
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
        let index = this.delegateMapEditor.myTileset.tiles.indexOf(tile);
        let q = Math.floor(index / 4);
        tile = this.delegateMapEditor.myTileset.tiles.get(4*q + Math.floor(Math.random()*4));
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
        let index = this.delegateMapEditor.myTileset.tiles.indexOf(tile);
        let q = Math.floor(index / 4);
        tile = this.delegateMapEditor.myTileset.tiles.get(4*q + Math.floor(Math.random()*4));
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
    
    let tile = this.delegateMapEditor.selectedTile;
    let height = this.delegateMapEditor.myMap.getCellTileHeight(x, y);
    if (height == this.floodHeight && this.delegateMapEditor.myMap.tileFits(x,y,tile)) {
      
      if (!this.properties.exactTile) {
        let index = this.delegateMapEditor.myTileset.tiles.indexOf(tile);
        let q = Math.floor(index / 4);
        tile = this.delegateMapEditor.myTileset.tiles.get(4*q + Math.floor(Math.random()*4));
      }
      this.delegateMapEditor.myMap.push(
        x, y,
        tile
      );
      this.flood(x+tile.properties.cellWidth,y);
      this.flood(x,y+tile.properties.cellDepth); 
      this.flood(x-tile.properties.cellWidth,y); 
      this.flood(x,y-tile.properties.cellDepth);
    }
  }
  
  mouseDownListener(ev) {}
  mouseUpListener(ev) {}
}

export class EraserTool implements MapEdTool {
  icon: IsoTile;
  properties = {}
  delegateMapEditor: MapeditorComponent;
  prevCell: { x: number, y: number } = null;
  
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
    
    let cell = this.delegateMapEditor.myCanvas.mouse.getCell();
    let cellTileHeight = this.delegateMapEditor.myMap.getCellTileHeight(cell.x, cell.y);
    if (this.prevCell) {
      if (this.prevCell.x !== cell.x || this.prevCell.y !== cell.y) {
        let prevCellTileHeight = this.delegateMapEditor.myMap.getCellTileHeight(this.prevCell.x, this.prevCell.y);
        if (prevCellTileHeight) {
          let prevCellTopTileData = this.delegateMapEditor.myMap.pop(this.prevCell.x, this.prevCell.y);
          this.delegateMapEditor.myMap.push(
            this.prevCell.x, this.prevCell.y,
            this.delegateMapEditor.myTileset.subTiles.get(prevCellTopTileData.tileIndex),
            1.0
          );
        }       
        if (cellTileHeight) {
          let topTileData = this.delegateMapEditor.myMap.pop(cell.x, cell.y);
          console.log(topTileData);
          this.delegateMapEditor.myMap.push(
            cell.x, 
            cell.y, 
            this.delegateMapEditor.myTileset.subTiles.get(topTileData.tileIndex),
            .751235
          );
        }
      }
    }
    this.prevCell = { x: cell.x, y: cell.y };
    this.delegateMapEditor.myCanvas.drawing.paint();
  }
  mouseWheelListener(ev) {
    this.delegateMapEditor.myCanvas.eventListeners.defaultMouseWheelListener(ev);
    this.delegateMapEditor.myCanvas.drawing.paint();
  }
  
  mouseDownListener(ev) {}
  mouseUpListener(ev) {}
}
