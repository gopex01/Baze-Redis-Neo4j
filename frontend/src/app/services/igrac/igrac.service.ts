import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Igrac } from 'src/app/shared/models/igrac';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as IgracActions from 'src/app/shared/state/igrac/igrac.actions';
import { selectSviIgraci } from 'src/app/shared/state/igrac/igrac.selector';
import { StoreService } from '../store.service';
@Injectable({
  providedIn: 'root',
})
export class IgracService {
  constructor(
    private store: Store,
    private http: HttpClient,
    private storeService: StoreService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  private urlIgrac = 'http://localhost:3000/igrac/';
  vratiSveIgrace(): Observable<Igrac[]> {
    const trenutnoPrijavljeniKorisnik$ =
      this.storeService.pribaviTrenutnoPrijavljenogKorisnika();
    let idKorisnika: number = 0;
    trenutnoPrijavljeniKorisnik$.subscribe((korisnik) => {
      idKorisnika = korisnik?.id as number;
    });
    const url: string = this.urlIgrac + `vratiMoguceSaigrace`;
    const headers: HttpHeaders = this.storeService.pribaviHeaders();
    return this.http.get<Igrac[]>(url, { headers });
  }

  dodajIgracaUTim(igrac: Igrac): void {
    return this.store.dispatch(IgracActions.dodajIgracaUTim({ igrac }));
  }
  vratiIgraceIzTima(): Observable<Igrac[]> {
    return this.store.select(selectSviIgraci);
  }
  vratiIgracePoKorisnickomImenu(korisnickoIme: string): Observable<Igrac[]> {
    const url = this.urlIgrac + `korisnickoIme/${korisnickoIme}`;
    const headers = this.storeService.pribaviHeaders();
    return this.http.get<Igrac[]>(url, { headers });
  }
  registrujSeKaoIgrac(igrac: Igrac): Subscription {
    const url = this.urlIgrac + 'registrujIgraca';
    return this.http.post(url, igrac).subscribe((p) => {
      if (p == null) {
        this._snackBar.open(
          'Zeljeno korisnicko ime je vec u upotrebi',
          'Zatvori',
          {
            duration: 4000,
          }
        );
      } else {
        this._snackBar.open('Uspesno ste se registrovali', 'Zatvori', {
          duration: 2000,
        });
        this.router.navigateByUrl('');
      }
    });
  }
  vidiSaigrace(turnirId: number, igracId: number): Observable<Igrac[]> {
    const headers = this.storeService.pribaviHeaders();
    const url = this.urlIgrac + `vratiIgraceIzIstogTima/${turnirId}/${igracId}`;
    return this.http.get<Igrac[]>(url, { headers });
  }

  izmeniPodatkeOIgracu(igrac: Igrac): Observable<Igrac> {
    const headers = this.storeService.pribaviHeaders();
    const url = this.urlIgrac + 'izmeniPodatkeOIgracu';
    return this.http.put<Igrac>(url, igrac, { headers });
  }

  daLiJeIgracPrijavljenNaTurnir(
    turnirId: number,
    igracId: number
  ): Observable<boolean> {
    const headers = this.storeService.pribaviHeaders();
    const url =
      this.urlIgrac + `daLiJeIgracPrijavljenNaTurnir/${turnirId}/${igracId}`;
    return this.http.get<boolean>(url, { headers });
  }
}
