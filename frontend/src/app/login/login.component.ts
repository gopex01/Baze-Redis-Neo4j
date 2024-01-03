import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginService } from '../services/login.service';
import { Igrac } from '../shared/models/igrac';
import { Organizator } from '../shared/models/organizator';
import * as KorisnikActions from '../shared/state/korisnik/korisnik.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  prijavljeniKorisnik: Igrac | Organizator | undefined;
  korisnickoIme: string = '';
  lozinka: string = '';

  constructor(
    private loginService: LoginService,
    private store: Store,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  async prijaviSe() {
    const tokenObservable = this.loginService.posaljiZahtevZaLogin(
      this.korisnickoIme,
      this.lozinka
    );
    let jwtToken: any;
    tokenObservable
      .pipe(
        catchError((error) => {
          this._snackBar.open(
            'Pogresno korisnicko ime ili lozinka',
            'zatvori',
            {
              duration: 4000,
            }
          );
          //console.error('Pogresno korisnicko ime ili lozinka', error);
          return of(null);
        })
      )
      .subscribe(async (token: any) => {
        jwtToken = token.access_token;
        console.log('jwt token je' + jwtToken);
        let korisnik: Igrac | Organizator | undefined = token.korisnik;

        if (korisnik) {
          this.prijavljeniKorisnik =
            korisnik.role == 'igrac'
              ? (korisnik as Igrac)
              : (korisnik as Organizator);
        }
        if (this.prijavljeniKorisnik) {
          this.store.dispatch(
            KorisnikActions.postaviPrijavljenogKorisnika({
              prijavljeniKorisnik: this.prijavljeniKorisnik,
            })
          );
          this.store.dispatch(
            KorisnikActions.postaviTokenPrijavljenogKorisnika({
              token: jwtToken,
            })
          );
        }
        this.router.navigateByUrl('');
      });
  }
}
