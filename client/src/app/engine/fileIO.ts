import { ValidationService } from '../services/validation.service';
import { IsoTile } from './isotile';
import { IsoTileSet } from './isotileset';
import { reject } from 'q';

export class FileIO {

  static image = {
    'loadFromClient': (): Promise<Array<HTMLImageElement>> => {
      return new Promise(resolve => {
        let images: Array<HTMLImageElement> = [];
        FileIO._openFileDialog(true, 'image/png', (event: Event) => {
          let fileList: FileList = (<HTMLInputElement>event.target).files;
          if (fileList) {
            let numFiles: number = fileList.length;
            let fileCounter: number = 0; 
            Array.from(fileList).forEach((file: File) => {
              if (file.type === 'image/png') {
                let newImage = new Image();
                let reader = new FileReader();
                reader.onload = ((readerEvent: Event) => {
                  newImage.src = <string>(<any>readerEvent.target).result;
                  newImage.onload = ((imgLoadEvent: Event) => {
                    images.push(newImage);
                    fileCounter++;
                    if (fileCounter === numFiles) {
                      resolve(images);
                    }
                  });
                });
                reader.readAsDataURL(file);
              } else {
                fileCounter++;
                if (fileCounter === numFiles) {
                  resolve(images);
                }
              }
            });
          } else {
            resolve(images);
          }
        });
      });
    } 
  }

  public static isoTileSet = {
    'loadFromClient': (): Promise<IsoTileSet> => {
      return new Promise<IsoTileSet>((resolve, reject) => {
        let tileSet = new IsoTileSet();
        FileIO._openFileDialog(true, 'application/json', (dialogEvent: Event) => {
          let fileList: FileList = (<HTMLInputElement>dialogEvent.target).files;
          if (fileList && fileList.length) {
            let fileCounter = 0;
            Array.from(fileList).forEach((file: File) => {
              FileIO._isoTileSet.fromFile(file).then((res: IsoTileSet) => {
                tileSet.union(res);
                fileCounter++;
                if (fileCounter === fileList.length) {
                  resolve(tileSet);
                }
              }).catch(err => reject(err));
            });
          } else {
            resolve(tileSet);
          }
        });
      });
    }
  }; private static _isoTileSet = {
    'fromFile': (isoTilesetFile: File): Promise<IsoTileSet> => {
      return new Promise((resolve, reject) => {
        let tileSet = new IsoTileSet();
        let reader: FileReader = new FileReader();
        reader.onload = ((readerEvent: Event) => {
          let file = JSON.parse((<any>readerEvent.target).result);
          let schemaErrors: Array<string> = ValidationService.prototype.validate(file, FileIO._schemas.isoTileSet);
          if (!schemaErrors.length) {
            tileSet.properties = file.properties;
            let loadedImagesCounter: number = 0;
            for (let fileImg of file.images) {
              let newImage = new Image();
              tileSet.images.insert(newImage);
              newImage.onload = ((imgLoadEvent: Event) => {
                loadedImagesCounter++;
                if (loadedImagesCounter === file.images.length) {
                  for (let tile of file.tiles) {
                    tileSet.tiles.insertOne(new IsoTile(
                        tileSet.images.get(tile.index),
                        tile.properties
                    ));
                  }
                  resolve(tileSet);
                }
              });
              newImage.onerror = function() {
                reject(['Error: Could not parse an image while trying to load tileset.']);
              }
              newImage.src = fileImg;
            }
          } else {
            reject(schemaErrors);
          }
        });
        reader.readAsText(isoTilesetFile);
      });
    }
  };

  private static _schemas = {
    'isoTileSet': {
      'properties': {
        'required': true,
        'type': {
          'tileSetName': {'required': true, 'type': 'string'},
          'isAnimation': {'required': true, 'type': 'boolean'},
          'animationLoops': {'required': true, 'type': 'boolean'},
          'fps': {'required': true, 'type': 'number', 'min': 0},
        }
      },
      'images': {
        'required': true,
        'type': 'string'
      },
      'tiles': {
        'required': true,
        'type': {
          'index': {
            'required': true,
            'type': 'number',
            'min': 0
          },
          'properties': {
            'required': false,
            'type': {
              'cellWidth': {'required': false, 'type': 'number', 'min': 1},
              'cellBreadth': {'required': false, 'type': 'number', 'min': 1},
              'cellDepth': {'required': false, 'type': 'number', 'min': 1},
              'cellHeight': {'required': false, 'type': 'number', 'min': 0},
              'subImageX': {'required': false, 'type': 'number', 'min': 0},
              'subImageY':  {'required': false, 'type': 'number', 'min': 0},
              'subImageWidth': {'required': false, 'type': 'number', 'min': 0},
              'subImageHeight': {'required': false, 'type': 'number', 'min': 0},
              'canStack': {'required': false, 'type': 'boolean'},
              'isClipped': {'required': false, 'type': 'boolean'},
              'isRamp': {'required': false, 'type': 'boolean'},
              'isSouthUpToNorthRamp': {'required': false, 'type': 'boolean'},
              'isEastUpToWestRamp': {'required': false, 'type': 'boolean'},
              'isNorthUpToSouthRamp': {'required': false, 'type': 'boolean'},
              'isWestUpToEastRamp': {'required': false, 'type': 'boolean'},
              'isHidden': {'required': false, 'type': 'boolean'} 
            }
          }
        }
      }
    }
  }

  private static _openFileDialog(multi: boolean, accept: string, onload: (event: Event) => any): any | null {
    let inputElement: HTMLInputElement = document.createElement('input');
    inputElement.setAttribute('type', 'file');
    inputElement.setAttribute('style', 'display:none');
    if (accept) inputElement.setAttribute('accept', accept);
    if (multi) inputElement.setAttribute('multiple', '');
    inputElement.addEventListener('change', onload, false);
    document.body.appendChild(inputElement);
      inputElement.click();
      setTimeout(function() {
          document.body.removeChild(inputElement);  
      }, 0);
  }
}