import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.css']
})
export class RoomCreateComponent implements OnInit {

  imgPath = '../../../assets/wallpapers/';
  portraitPath = "../../../../assets/";
  imgNum = 0;
  players = [];

  constructor() { }

  ngOnInit() {
    this.imgNum = Math.floor(Math.random()*4) + 1;
  }

}
