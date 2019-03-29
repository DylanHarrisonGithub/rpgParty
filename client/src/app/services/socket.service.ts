import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

import config from '../config/config.json';
import { IOffset } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: SocketIOClient.Socket;

  constructor() { }

  connect(msg) {
    this.socket = io.connect(config.URI[config.ENVIRONMENT], { query: "msg=" + JSON.stringify(msg) });
  }

  onMessage() {
    return Observable.create(observer => {
      this.socket.on('message', msg => {
        observer.next(msg);
      });
    });
  }
}
