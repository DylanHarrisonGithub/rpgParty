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
}

export class HandTool implements MapEdTool {
    icon: IsoTile;
    properties: {
        dummy: 5,
        hello: "test",
        bool: true
    }
    isoCanvas: IsoCanvas;
    constructor(isoCanvas: IsoCanvas, icon: IsoTile) {
        this.icon = icon;
        this.isoCanvas = isoCanvas;
    }
    mouseClickListener(ev) {
        console.log('click');
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
}
export class BrushTool implements MapEdTool {
    icon: IsoTile;
    properties: {}
    delegateMapEditor: MapeditorComponent;
    
    constructor(delegateMapEditor: MapeditorComponent, icon: IsoTile) {
        this.icon = icon;
        this.delegateMapEditor = delegateMapEditor;
    }
    mouseClickListener(ev) {
        this.delegateMapEditor.myMap.push(
            this.delegateMapEditor.myCanvas.mouse.getCell().x,
            this.delegateMapEditor.myCanvas.mouse.getCell().y,
            this.delegateMapEditor.selectedTile
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
}

export class LineTool implements MapEdTool {
    icon: IsoTile;
    properties: {}
    isoCanvas: IsoCanvas;
    map: GameMap;
    constructor(isoCanvas: IsoCanvas, map: GameMap, icon: IsoTile) {
        this.icon = icon;
        this.isoCanvas = isoCanvas;
        this.map = map;
    }
    mouseClickListener(ev) {
        this.isoCanvas.eventListeners.defaultMouseClickListener(ev);
        this.isoCanvas.drawing.paint();
    }
    mouseMoveListener(ev) {
        this.isoCanvas.eventListeners.defaultMouseMoveListener(ev);
    }
    mouseWheelListener(ev) {
        this.isoCanvas.eventListeners.defaultMouseWheelListener(ev);
        this.isoCanvas.drawing.paint();
    }
}

export class BoxTool implements MapEdTool {
    icon: IsoTile;
    properties: {}
    isoCanvas: IsoCanvas;
    map: GameMap;
    constructor(isoCanvas: IsoCanvas, map: GameMap, icon: IsoTile) {
        this.icon = icon;
        this.isoCanvas = isoCanvas;
        this.map = map;
    }
    mouseClickListener(ev) {
        this.isoCanvas.eventListeners.defaultMouseClickListener(ev);
        this.isoCanvas.drawing.paint();
    }
    mouseMoveListener(ev) {
        this.isoCanvas.eventListeners.defaultMouseMoveListener(ev);
    }
    mouseWheelListener(ev) {
        this.isoCanvas.eventListeners.defaultMouseWheelListener(ev);
        this.isoCanvas.drawing.paint();
    }
}

export class BucketTool implements MapEdTool {
    icon: IsoTile;
    delegateMapEditor: MapeditorComponent;
    properties: {}
    floodHeight: number;

    constructor(delegateMapEditor: MapeditorComponent, icon: IsoTile) {
        this.icon = icon;
        this.delegateMapEditor = delegateMapEditor;
    }
    mouseClickListener(ev) {
        this.floodHeight = this.delegateMapEditor.myMap.getCellStackingHeight(
            this.delegateMapEditor.myCanvas.mouse.getCell().x,
            this.delegateMapEditor.myCanvas.mouse.getCell().y,
        );
        if (this.floodHeight || this.floodHeight === 0) {
            this.flood(
                this.delegateMapEditor.myCanvas.mouse.getCell().x,
                this.delegateMapEditor.myCanvas.mouse.getCell().y,
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
            console.log(height);
            this.delegateMapEditor.myMap.push(
                x, y,
                this.delegateMapEditor.selectedTile
            );
            this.flood(x+1,y);
            this.flood(x,y+1); 
            this.flood(x-1,y); 
            this.flood(x,y-1);
        }
    }
}

export class EraserTool implements MapEdTool {
    icon: IsoTile;
    properties: {}
    delegateMapEditor: MapeditorComponent;
    
    constructor(delegateMapEditor: MapeditorComponent, icon: IsoTile) {
        this.icon = icon;
        this.delegateMapEditor = delegateMapEditor;
    }
    mouseClickListener(ev) {
        this.delegateMapEditor.myMap.pop(
            this.delegateMapEditor.myCanvas.mouse.getCell().x,
            this.delegateMapEditor.myCanvas.mouse.getCell().y
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
}
