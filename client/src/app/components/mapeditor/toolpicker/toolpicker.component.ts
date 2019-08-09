import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { FileIO } from 'src/app/engine/fileIO';

import config from '../../../config/config.json';
import { IsoTileSet } from 'src/app/engine/isotileset.js';
import { MapEdTool, HandTool, BrushTool, LineTool, BoxTool, BucketTool, EraserTool } from 'src/app/engine/mapedtools/mapedtool.js';
import { MapeditorComponent } from '../mapeditor.component.js';

@Component({
  selector: 'app-toolpicker',
  templateUrl: './toolpicker.component.html',
  styleUrls: ['./toolpicker.component.css']
})
export class ToolpickerComponent implements OnDestroy {

  private delegateMapEditor: MapeditorComponent = null;
  private mapedTools: Array<MapEdTool> = new Array<MapEdTool>();

  selectedTool: MapEdTool = null;

  private eventListeners = {
    click: Event = null,
    mousemove: Event = null,
    wheel: Event = null,
    mousedown: Event = null,
    mouseup: Event = null,
  }

  constructor() {}

  init(delegateMapEditor) {

    this.delegateMapEditor = delegateMapEditor;

    FileIO.isoTileSet.loadFromServer([
      config.URI[config.ENVIRONMENT] + 'assets/tilesets/mapedtools.json'
    ]).then((res: Array<IsoTileSet>) => res[0]).then((icons: IsoTileSet) => {
      this.mapedTools.push(new HandTool(this.delegateMapEditor.myCanvas, icons.tiles.get(0)));
      this.mapedTools.push(new BrushTool(this.delegateMapEditor, icons.tiles.get(1)));
      this.mapedTools.push(new LineTool(this.delegateMapEditor, icons.tiles.get(2)));
      this.mapedTools.push(new BoxTool(this.delegateMapEditor, icons.tiles.get(3)));
      this.mapedTools.push(new BucketTool(this.delegateMapEditor, icons.tiles.get(4)));
      this.mapedTools.push(new EraserTool(this.delegateMapEditor, icons.tiles.get(5)));
      this.select(this.mapedTools[0]);

      let canvasDiv = this.delegateMapEditor.myCanvas.getDelegateDiv();
      this.eventListeners.click = canvasDiv.addEventListener('click', (ev) => {
        this.selectedTool.mouseClickListener(ev);
      });
      this.eventListeners.mousemove = canvasDiv.addEventListener('mousemove', (ev) => {
        this.selectedTool.mouseMoveListener(ev);
      });
      this.eventListeners.wheel = canvasDiv.addEventListener('wheel', (ev) => {
        this.selectedTool.mouseWheelListener(ev);
      });
      this.eventListeners.mousedown = canvasDiv.addEventListener('mousedown', (ev) => {
        this.selectedTool.mouseDownListener(ev);
      });
      this.eventListeners.mouseup = canvasDiv.addEventListener('mouseup', (ev) => {
        this.selectedTool.mouseUpListener(ev);
      });
    }).catch(err =>  console.log(err));
  }

  ngOnDestroy() {
    let canvasDiv = this.delegateMapEditor.myCanvas.getDelegateDiv();
    if (canvasDiv) {
      for (let key in this.eventListeners) {
        canvasDiv.removeEventListener(key, this.eventListeners[key]);
      }
    }
  }

  select(tool: MapEdTool) {
    this.selectedTool = tool;
  }

  templating = {
    typeCheckers: {
      isBoolean: (x: any) => { return typeof x === "boolean"; },
      isNumber: (x: any) => { return typeof x === "number"; },
      isString: (x: any) => { 
        return !(this.templating.typeCheckers.isBoolean(x) || this.templating.typeCheckers.isNumber(x));
      }
    },
    trackByFn(index,item){ return item.key; }
  }
}
