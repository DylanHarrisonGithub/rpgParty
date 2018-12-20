export class IsoTile {

    public image: HTMLImageElement;
    public properties = {
        'cellWidth': 1,
        'cellBreadth': 1,
        'cellDepth': 1,
        'cellHeight': 1,
        'subImageX': 0,
        'subImageY': 0,
        'subImageWidth': 0,
        'subImageHeight': 0,
        'canStack': true,
        'stackingHeight': 1.0,
        'isClipped': true,
        'isRamp': false,
        'isSouthUpToNorthRamp': false,
        'isEastUpToWestRamp': false,
        'isNorthUpToSouthRamp': false,
        'isWestUpToEastRamp': false,
        'isHidden': false, 
    }
    public subTiles: IsoTile[];
    public parent: IsoTile;

    constructor(img: HTMLImageElement, params: Object) {

        this.image = img;
        this.properties.subImageX = 0;
        this.properties.subImageY = 0;
        this.subTiles = new Array<IsoTile>();
        if (img) {
            this.properties.subImageWidth = this.image.width;
            this.properties.subImageHeight = this.image.height;
        }

        if (params) {
            for (let key in params) {
                if (key in this.properties) {
                    this.properties[key] = params[key];
                }
            }
        }

        // enforce cell height law
        this.calculateCellHeight();

        // generate subtiles
        if (this.properties.cellWidth == 1 && this.properties.cellDepth == 1) {
            // terminate recursion
            this.subTiles.push(this);
        } else {
            let newProperties =  JSON.parse(JSON.stringify(this.properties));   // clone json data
            newProperties.cellWidth = 1;
            newProperties.cellDepth = 1;
            let width = this.isoToCanvas(1,0).x - this.isoToCanvas(0,1).x;
            let height = this.isoToCanvas(1,1).y;
            for (let y = 0; y < this.properties.cellDepth; y++) {
                for (let x = 0; x < this.properties.cellWidth; x++) {
                    newProperties.subImageX = this.properties.subImageX + this.isoToCanvas(x-1, y).x;
                    newProperties.subImageY = this.properties.subImageY + this.isoToCanvas(x+1,y+1).y - height;
                    newProperties.subImageWidth = width;
                    newProperties.subImageHeight = height;
                    this.subTiles.push(new IsoTile(this.image, newProperties));
                    this.subTiles[this.subTiles.length-1].parent = this;
                }
            }
        }
    }

    calculateCellHeight() {
        let w = this.properties.subImageWidth;
        let h = this.properties.subImageHeight;
        this.properties.cellHeight = (2*(h/w) - 1) * ((this.properties.cellWidth + this.properties.cellDepth) / 2);        
    }
    isoToCanvas(x: number, y: number) {
        return {
            'x': ((x-y+this.properties.cellDepth)/(this.properties.cellWidth+this.properties.cellDepth))*this.properties.subImageWidth,
            'y': ((x+y+2*this.properties.cellHeight)/(this.properties.cellWidth+this.properties.cellDepth+2*this.properties.cellHeight))*this.properties.subImageHeight
        }
    }

}