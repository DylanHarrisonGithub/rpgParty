import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../config/config.json';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private _http: HttpClient) { }

  getTilesetList() {
    return this._http.get(config.URI[config.ENVIRONMENT] + 'assets/tilesets');
  }
  getTileset(tilesetName: string) {
    return this._http.get(config.URI[config.ENVIRONMENT] + 'assets/tilesets/' + tilesetName);
  }

  getMapList() {
    return this._http.get(config.URI[config.ENVIRONMENT] + 'assets/maps');
  }
  getMap(mapName: string) {
    return this._http.get(config.URI[config.ENVIRONMENT] + 'assets/maps/' + mapName);
  }
}
