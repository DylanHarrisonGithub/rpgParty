import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IsoTileSet } from 'src/app/engine/isotileset';
import { FileIO } from 'src/app/engine/fileIO';

@Component({
  selector: 'app-tse-image-picker',
  templateUrl: './tse-image-picker.component.html',
  styleUrls: ['./tse-image-picker.component.css']
})
export class TseImagePickerComponent implements OnInit {

  @Input() tileset: IsoTileSet = new IsoTileSet();
  @Output() import: EventEmitter<Array<HTMLImageElement>> = new EventEmitter<Array<HTMLImageElement>>();
  @Output() remove: EventEmitter<HTMLImageElement> = new EventEmitter<HTMLImageElement>();
  @Output() select: EventEmitter<HTMLImageElement> = new EventEmitter<HTMLImageElement>();
  constructor() { }

  ngOnInit() {
  }

  buttons = {
    import: () => { 
      FileIO.image.loadFromClient().then((images: Array<HTMLImageElement>) => {
        this.tileset.images.insert(images);
        this.import.emit(images);
      });
    },
    select: (img: HTMLImageElement) => {
      this.select.emit(img);
    },       
    remove: (image: HTMLImageElement) => {
      this.tileset.images.remove(image);
      this.remove.emit(image);
    }
  }

}
