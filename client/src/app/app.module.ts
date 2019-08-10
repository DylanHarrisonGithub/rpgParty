import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxImgCrossfaderModule } from 'ngx-img-crossfader';
import { AngularResizedEventModule } from 'angular-resize-event';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TileseteditorComponent } from './components/tileseteditor/tileseteditor.component';
import { MapeditorComponent } from './components/mapeditor/mapeditor.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { TilesetLoadDialogComponent } from './components/modals/tileset-load-dialog/tileset-load-dialog.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { RoomCreateComponent } from './components/room-create/room-create.component';
import { RoomJoinComponent } from './components/room-join/room-join.component';
import { PlayComponent } from './components/play/play.component';
import { CreateCharacterComponent } from './components/modals/create-character/create-character.component';
import { DeleteCharacterComponent } from './components/modals/delete-character/delete-character.component';
import { QuestLoadDialogComponent } from './components/modals/quest-load-dialog/quest-load-dialog.component';
import { BkgCrossfaderComponent } from './components/bkg-crossfader/bkg-crossfader.component';
import { WaitingComponent } from './components/waiting/waiting.component';
import { ControllerComponent } from './components/controller/controller.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { TouchpadComponent } from './components/controller/touchpad/touchpad.component';
import { TilepickerComponent } from './components/mapeditor/tilepicker/tilepicker.component';
import { ToolpickerComponent } from './components/mapeditor/toolpicker/toolpicker.component';
import { NewMapDialogComponent } from './components/modals/new-map-dialog/new-map-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    TileseteditorComponent,
    MapeditorComponent,
    RegisterComponent,
    LoginComponent,
    TilesetLoadDialogComponent,
    NavbarComponent,
    HomeComponent,
    RoomCreateComponent,
    RoomJoinComponent,
    PlayComponent,
    CreateCharacterComponent,
    DeleteCharacterComponent,
    QuestLoadDialogComponent,
    BkgCrossfaderComponent,
    WaitingComponent,
    ControllerComponent,
    SandboxComponent,
    TouchpadComponent,
    TilepickerComponent,
    ToolpickerComponent,
    NewMapDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({positionClass: 'toast-bottom-full-width'}),
    NgbModule,
    NgxImgCrossfaderModule,
    AngularResizedEventModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    TilesetLoadDialogComponent,
    QuestLoadDialogComponent,
    CreateCharacterComponent,
    DeleteCharacterComponent,
    NewMapDialogComponent
  ]
})
export class AppModule { }
