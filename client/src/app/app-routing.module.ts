import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapeditorComponent } from './components/mapeditor/mapeditor.component';
import { TileseteditorComponent } from './components/tileseteditor/tileseteditor.component';

const routes: Routes = [
  { 'path': 'mapeditor', 'component': MapeditorComponent },
  { 'path': 'tileseteditor', 'component': TileseteditorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
