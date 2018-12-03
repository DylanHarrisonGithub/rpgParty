import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TileseteditorComponent } from './components/tileseteditor/tileseteditor.component';
import { MapeditorComponent } from './components/mapeditor/mapeditor.component';

@NgModule({
  declarations: [
    AppComponent,
    TileseteditorComponent,
    MapeditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
