import { ValidationService } from '../services/validation.service';
import { IsoTile } from './isotile';
import { IsoTileSet } from './isotileset';

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
    'loadFromClient': (): Promise<Array<IsoTileSet>> => {
      return new Promise<Array<IsoTileSet>>((resolve, reject) => {
        let tileSets = new Array<IsoTileSet>();
        FileIO._openFileDialog(true, 'application/json', (dialogEvent: Event) => {
          let fileList: FileList = (<HTMLInputElement>dialogEvent.target).files;
          if (fileList && fileList.length) {
            let fileCounter = 0;
            Array.from(fileList).forEach((file: File) => {
              let reader: FileReader = new FileReader(); 
              reader.onload = ((readerEvent: Event) => {
                let jsonTileSet = JSON.parse((<any>readerEvent.target).result);
                FileIO._isoTileSet.fromJSON(jsonTileSet).then((res: IsoTileSet) => {
                  tileSets.push(res);
                  fileCounter++;
                  if (fileCounter === fileList.length) {
                    resolve(tileSets);
                  }
                }).catch(err => reject(err));
              });
              reader.readAsText(file);
            });
          } else {
            resolve(tileSets);
          }
        });
      });
    },
    'loadFromServer': (filename: string | Array<string>): Promise<Array<IsoTileSet>> => {
      return new Promise((resolve, reject) => {
        let tileSets = new Array<IsoTileSet>();
        if (typeof filename === 'string') {
          fetch(filename).then(res => res.json()).then(res => {
            FileIO._isoTileSet.fromJSON(res).then((res: IsoTileSet) => {
              tileSets.push(res);
              resolve(tileSets);
            }).catch(err => reject(err));
          }).catch(err => reject(err));
        } else {
          let fileCount = 0;
          filename.forEach((file: string) => {
            fetch(file).then(res => res.json()).then(res => {
              FileIO._isoTileSet.fromJSON(res).then((res: IsoTileSet) => {
                tileSets.push(res);
                fileCount++;
                if (fileCount === filename.length) {
                  resolve(tileSets);
                }
              }).catch(err => reject(err));
            }).catch(err => reject(err));
          });
        }
      });
    },
    'save': (tileSet: IsoTileSet): void => {

      let file = FileIO._isoTileSet.toBlob(tileSet);
      let anchor = document.createElement('a');
      anchor.setAttribute('style', 'display:none');
      let url = URL.createObjectURL(file);
      anchor.href = url;
      anchor.download = tileSet.properties.tileSetName + '.json';
      document.body.appendChild(anchor);
      anchor.click();
      setTimeout(function() {
          document.body.removeChild(anchor);
          window.URL.revokeObjectURL(url);  
      }, 0);

    }
  }; private static _isoTileSet = {
    'fromJSON': (isoTileSetJSON: any): Promise<IsoTileSet> => {
      return new Promise<IsoTileSet>((resolve, reject) => {
        let tileSet = new IsoTileSet();
        let schemaErrors: Array<string> = ValidationService.prototype.validate(isoTileSetJSON, FileIO._schemas.isoTileSet);
          if (!schemaErrors.length) {
            tileSet.properties = isoTileSetJSON.properties;
            let loadedImagesCounter: number = 0;
            for (let fileImg of isoTileSetJSON.images) {
              let newImage = new Image();
              tileSet.images.insert(newImage);
              newImage.onload = ((imgLoadEvent: Event) => {
                loadedImagesCounter++;
                if (loadedImagesCounter === isoTileSetJSON.images.length) {
                  for (let tile of isoTileSetJSON.tiles) {
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
    },
    'toBlob': (tileSet: IsoTileSet): Blob => {
      let images = [];
      tileSet.images.forEach((value, index) => images.push(value.src));
      let tiles = [];
      tileSet.tiles.forEach((value, index) => tiles.push({
        'index': tileSet.images.indexOf(value.image),
        'properties': value.properties
      }));

      let blob = new Blob([JSON.stringify({
          'properties': tileSet.properties,
          'images': images,
          'tiles': tiles            
      })], {type: 'application/json'});

      return blob;
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