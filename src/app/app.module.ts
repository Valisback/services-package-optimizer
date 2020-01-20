import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AngularFireModule } from '@angular/fire';
import { MatStepperModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFireDatabaseModule } from '@angular/fire/database';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    OAuthModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatStepperModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
