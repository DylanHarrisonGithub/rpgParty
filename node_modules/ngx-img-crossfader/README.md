# ngx-img-crossfader

![Failed to load crossfader preview gif](https://raw.githubusercontent.com/DylanHarrisonGithub/ngx-img-crossfader/master/screenshots/crossfader.gif "crossfader")

[https://www.npmjs.com/package/ngx-img-crossfader](https://www.npmjs.com/package/ngx-img-crossfader)

## About

Simple to use Angular image crossfader component.

## Features

- Image fit with preserved aspect ratio.
- Inherit z-index from parent element.
- Configure background color, idle time, transition time, etc.
- Able to add images dynamically.
- Auto-advance or advance and step back manually.

## Instructions

#### Installation
```
npm install ngx-img-crossfader --save
```
#### Setup
1. add ngx-img-crossfader.css into project angular.json
```JSON
"styles": [
  "styles.css",
  "node_modules/ngx-img-crossfader/ngx-img-crossfader.css"
]
```
2. Import NgxImgCrossfaderModule into app.module.ts and add to imports.
```TypeScript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxImgCrossfaderModule } from 'ngx-img-crossfader';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxImgCrossfaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
3. Import NgxImgCrossfaderComponent in desired components and template
```TypeScript
import { Component, ViewChild } from '@angular/core';
import { NgxImgCrossfaderComponent } from 'ngx-img-crossfader'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  
  myImageSources = [
    './my/image/location/image.jpg',
    'www.my/image/url.com/anotherImage.png'
  ];

  @ViewChild('myCrossfader') myCrossfader: NgxImgCrossfaderComponent;

  constructor() { }
  
  next() { myCrossfader.stepForaward() }
  back() { myCrossfader.stepBackward() }
}
```
```Html
...
<ngx-img-crossfader [imageSources]="myImageSources" #myCrossfader></ngx-img-crossfader>
<button (click)="back()">Back</button>
<button (click)="next()">Next</button>
...
```
#### Inputs
- idleTimeMS: Time between transitions in MS, Default: 5000.
- transitionTimeMS: Transition time in MS. Default: 1000.
- imageSources: Array\<string> of image sources to crossfade. Default: [].
- backgroundColor: Background color. Default: 'rgba(0,0,0,1.0)'.
- autoAdvance: boolean. step forward automatically. Default: true.
