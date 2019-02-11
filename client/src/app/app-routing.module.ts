import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapeditorComponent } from './components/mapeditor/mapeditor.component';
import { TileseteditorComponent } from './components/tileseteditor/tileseteditor.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { 'path': 'mapeditor', 'component': MapeditorComponent },
  { 'path': 'tileseteditor', 'component': TileseteditorComponent },
  { 'path': 'register', 'component': RegisterComponent },
  { 'path': 'login', 'component': LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
