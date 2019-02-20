import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private _http: HttpClient) { }

  getTilesetList() {
    return this._http.get('http://localhost:3000/assets/tilesets');
  }
  getTileset(tilesetName: string) {
    return this._http.get('http://localhost:3000/assets/tilesets/' + tilesetName);
  }

  getMapList() {
    return this._http.get('http://localhost:3000/assets/maps');
  }
  getMap(mapName: string) {
    return this._http.get('http://localhost:3000/assets/maps/' + mapName);
  }
}
