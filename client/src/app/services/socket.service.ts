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

  disconnect() {
    this.socket.close();
  }

  toRoom(room, msg) {
    this.socket.emit('message', { room: room, msg: msg });
  }

  toSock(room, soc_id, msg) {
    this.socket.emit('message', { room: room, soc_id: soc_id, msg: msg });
  }

  onMessage() {
    return Observable.create(observer => {
      this.socket.on('message', msg => {
        observer.next(msg);
      });
    });
  }

}
