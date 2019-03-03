import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { TileseteditorComponent } from './components/tileseteditor/tileseteditor.component';
import { MapeditorComponent } from './components/mapeditor/mapeditor.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { TilesetLoadDialogComponent } from './components/modals/tileset-load-dialog/tileset-load-dialog.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [TilesetLoadDialogComponent]
})
export class AppModule { }
