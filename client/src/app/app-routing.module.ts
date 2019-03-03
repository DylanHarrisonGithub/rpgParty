import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapeditorComponent } from './components/mapeditor/mapeditor.component';
import { TileseteditorComponent } from './components/tileseteditor/tileseteditor.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'mapeditor', component: MapeditorComponent },
  { path: 'tileseteditor', component: TileseteditorComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '',  pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
