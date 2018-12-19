import { IsoTile } from './isotile';
export class IsoTileSet {

    public properties = {
        tileSetName: 'untitled set',
        isAnimation: false,
        animationLoops: false,
        fps: 0.0
    };
    private _images: HTMLImageElement[] = [];    //should be private
    public _isoTiles: IsoTile[] = [];           //should be private

    constructor() {        
    }

    tiles = {
        getLength: () => { return this._isoTiles.length; },
        get: (index: number) => {
            if (index > -1 && index < this.tiles.getLength()) {
                return this._isoTiles[index];
            } else {
                return null;
            }
        },
        insertOne: (tile: IsoTile) => { this._isoTiles.push(tile); },
        insertArray: (tileArray: IsoTile[]) => { 
            for (let tile of tileArray) this._isoTiles.push(tile); 
        },
        removeOne: (tile: IsoTile) => { 
            let index = this._isoTiles.indexOf(tile);
            if (index > -1) this._isoTiles.splice(index, 1);
        },
        removeArray: (tileArray: IsoTile[]) => {
            for (let tile of tileArray) this.tiles.removeOne(tile);
        },
        contains: (tile: IsoTile) => { return (this._isoTiles.indexOf(tile) > -1) },
        indexOf: (tile: IsoTile) => { return (this._isoTiles.indexOf(tile)) },
        forEach: (f: (value: IsoTile, index: number) => any) => { 
            for (let i = 0; i < this._isoTiles.length; i++) {
                f(this._isoTiles[i], i);
            }
        },
        moveUp: (tile: IsoTile) => {
            if (this.tiles.contains(tile)) {
                let index = this.tiles.indexOf(tile);
                if (index > 0) {
                    let temp = this._isoTiles[index-1];
                    this._isoTiles[index-1] = this._isoTiles[index];
                    this._isoTiles[index] = temp;
                }
            }
        },
        moveDown: (tile: IsoTile) => {
            if (this.tiles.contains(tile)) {
                let index = this.tiles.indexOf(tile);
                if (index < (this.tiles.getLength()-1)) {
                    let temp = this._isoTiles[index+1];
                    this._isoTiles[index+1] = this._isoTiles[index];
                    this._isoTiles[index] = temp;
                }
            }
        }
    };
    images = {
        remove: (image: HTMLImageElement) => {
            this._images.splice(this._images.indexOf(image), 1);
            this._isoTiles.forEach(tile => {
                if (tile.image == image) tile.image = null;
            });
        }
    }

    loadImageFromClient(onload: Function) { 
        let inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'file');
        inputElement.setAttribute('style', 'display:none');
        inputElement.addEventListener('change', (ev) => {
            if (inputElement.files.length > 0) {
                let newImage = new Image();
                var reader = new FileReader();
                reader.onload = ((event) => {
                    newImage.src = (<any>event.target).result;
                    newImage.onload = ((event) => {
                        this._images.push(newImage);
                        onload();
                    });
                });
                reader.readAsDataURL(inputElement.files[0]);
            }
        }, false);
        document.body.appendChild(inputElement);
        inputElement.click();
        setTimeout(function() {
            document.body.removeChild(inputElement);  
        }, 0);        
    }

    dumbSave() {

        let filename = this.properties.tileSetName + '.json';
        
        let images = [];
        for (let img of this._images) {
            images.push(img.src);
        }
        
        let tiles = [];
        for (let tile of this._isoTiles) {
            tiles.push({
                'index': this._images.indexOf(tile.image),
                'properties': tile.properties
            });
        }
        let file = new Blob([JSON.stringify({
            'properties': this.properties,
            'images': images,
            'tiles': tiles            
        })], {type: 'application/json'});        
        let anchor = document.createElement('a');
        anchor.setAttribute('style', 'display:none');
        let url = URL.createObjectURL(file);
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        setTimeout(function() {
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(url);  
        }, 0);        
    }

    dumbLoad(onloaded: Function) {
        let inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'file');
        inputElement.setAttribute('style', 'display:none');
        inputElement.addEventListener('change', (ev) => {
            if (inputElement.files.length > 0) {
                var reader = new FileReader();
                reader.onload = ((event) => {
                    let file = JSON.parse((<any>event.target).result);
                    this.properties = file.properties;
                    
                    this._images = [];                    
                    let numImages = file.images.length;
                    let loadedCounter = 0;
                    for (let fileImg of file.images) {
                        let newImage = new Image();
                        this._images.push(newImage);
                        newImage.onload = ((event) => {
                            loadedCounter++;
                            if (loadedCounter == numImages) {
                                this._isoTiles = [];
                                for (let tile of file.tiles) {
                                    this._isoTiles.push(new IsoTile(
                                        this._images[tile.index],
                                        tile.properties
                                    ));
                                    //console.log(tile);
                                }
                                onloaded();
                            }
                        });
                        newImage.onerror = function() {
                            console.log('image did not load');
                            numImages--;
                        }
                        newImage.src = fileImg;
                    }
                    //onloaded();
                });
                reader.readAsText(inputElement.files[0]);
            }
        }, false);
        document.body.appendChild(inputElement);
        inputElement.click();
        setTimeout(function() {
            document.body.removeChild(inputElement);  
        }, 0);        
    }

    loadFromServer(filename: string, onload: Function) {
        fetch(filename).then(res => res.json()).then(file => {
            if (file.error) {
                console.log(file);
            } else {
                this.properties = file.properties;
                this._images = [];                    
                let numImages = file.images.length;
                //console.log('numImages: ', numImages);
                let loadedCounter = 0;
                for (let fileImg of file.images) {
                    let newImage = new Image();
                    this._images.push(newImage);
                    newImage.onload = ((event) => {
                        newImage.onload = null;
                        loadedCounter++;
                        //console.log('loading progress: ', loadedCounter);
                        if (loadedCounter == numImages) {
                            this._isoTiles = [];
                            for (let tile of file.tiles) {
                                this._isoTiles.push(new IsoTile(
                                    this._images[tile.index],
                                    tile.properties
                                ));
                            }
                            //console.log('tileset loading complete');
                            onload();
                        }
                    });
                    newImage.onerror = function(e) {
                        console.log('image did not load', e);
                        numImages--;
                    }
                    newImage.src = fileImg;
                }
            }
            
            //onload();
        });
    }

}