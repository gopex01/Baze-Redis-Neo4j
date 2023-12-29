import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TurnirComponent } from './turnir/turnir.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { KreiranjeTurniraComponent } from './kreiranje-turnira/kreiranje-turnira.component';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';

import { IgracComponent } from './igrac/igrac.component';
import { ProfilComponent } from './profil/profil.component';
import { IgraciNaTurniruComponent } from './igraci-na-turniru/igraci-na-turniru.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { HttpClientModule } from '@angular/common/http';
import { SviIgraciComponent } from './svi-igraci/svi-igraci.component';
import { prijavaReducer } from './shared/state/prijava/prijava.reducer';
import { PrijavaComponent } from './prijava/prijava.component';
import { PreferenceComponent } from './preference/preference.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SearchBarComponent } from './search-bar/search-bar.component';

import { TimoviNaTurniruComponent } from './timovi-na-turniru/timovi-na-turniru.component';
import { korisnikReducer } from './shared/state/korisnik/korisnik.reducer';
import { MojiTurniriComponent } from './moji-turniri/moji-turniri.component';
import { MojiSaigraciComponent } from './moji-saigraci/moji-saigraci.component';
import { initialStateTurnir } from './shared/state/turnir/turnir.state';
import { turnirReducer } from './shared/state/turnir/turnir.reducer';
import { igracReducer } from './shared/state/igrac/igrac.reducer';

@NgModule({
  declarations: [
    AppComponent,
    TurnirComponent,
    HomeComponent,
    HeaderComponent,
    TurnirComponent,
    KreiranjeTurniraComponent,
    IgracComponent,
    ProfilComponent,
    IgraciNaTurniruComponent,
    LoginComponent,
    RegistracijaComponent,
    SviIgraciComponent,
    PrijavaComponent,
    PreferenceComponent,
    SearchBarComponent,
    TimoviNaTurniruComponent,
    MojiTurniriComponent,
    MojiSaigraciComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    BrowserAnimationsModule,

    StoreModule.forRoot({
      turnirState: turnirReducer,
    }),

    StoreModule.forFeature('turnirUPrijavi', prijavaReducer),
    StoreModule.forFeature('igraciUPrijavi', prijavaReducer),
    StoreModule.forFeature('preferenceUPrijavi', prijavaReducer),
    StoreModule.forFeature('prijavljeniKorisnik', korisnikReducer),
    StoreModule.forFeature('token', korisnikReducer),
    StoreModule.forFeature('turniriPretraga', turnirReducer),
    StoreModule.forFeature('turniri', turnirReducer),
    StoreModule.forFeature('igraci', igracReducer),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
