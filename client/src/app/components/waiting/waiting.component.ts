import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent implements OnInit {

  @Input() leader = false;

  constructor() { }

  ngOnInit() {
  }

}
