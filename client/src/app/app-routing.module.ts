import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapeditorComponent } from './components/mapeditor/mapeditor.component';
import { TileseteditorComponent } from './components/tileseteditor/tileseteditor.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RoomCreateComponent } from './components/room-create/room-create.component';
import { RoomJoinComponent } from './components/room-join/room-join.component';
import { PlayComponent } from './components/play/play.component';
import { ControllerComponent } from './components/controller/controller.component';

import { AuthGuard } from './guards/auth.guard';
import { BkgCrossfaderComponent } from './components/bkg-crossfader/bkg-crossfader.component';
import { WaitingComponent } from './components/waiting/waiting.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create', component: RoomCreateComponent, canActivate: [AuthGuard] },
  { path: 'join', component: RoomJoinComponent, canActivate: [AuthGuard] },
  { path: 'waiting', component: WaitingComponent, canActivate: [AuthGuard] },
  { path: 'play', component: PlayComponent, canActivate: [AuthGuard] },
  { path: 'controller', component: ControllerComponent, canActivate: [AuthGuard] },
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
