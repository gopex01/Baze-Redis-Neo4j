import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Prijava } from '../shared/models/prijava';
import * as IgracActions from '../shared/state/igrac/igrac.actions';
import * as PrijavaActions from '../shared/state/prijava/prijava.actions';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class PrijavaService {
  constructor(
    private store: Store,
    private http: HttpClient,
    private storeService: StoreService,
    private _snackBar: MatSnackBar
  ) {}
  prijavaUrl = 'http://localhost:3000/prijava/';
  posaljiPrijavuUBazu(prijava: Prijava) {
    const headers = this.storeService.pribaviHeaders();

    const url = this.prijavaUrl + 'dodajPrijavu';
    return this.http.post(url, prijava, { headers }).subscribe((p: any) => {
      if (p.porukaGreske == undefined) {
        this.store.dispatch(PrijavaActions.OcistiStore());
        this.store.dispatch(IgracActions.ocistiStore());
        this._snackBar.open('Uspesno ste se prijavili na turnir', 'Zatvori', {
          duration: 2000,
        });
      } else {
        this._snackBar.open(p.porukaGreske, 'Zatvori', {
          duration: 2000,
        });
      }
    });
  }

  vratiPrijaveZaTurnir(turnirId: number): Observable<Prijava[]> {
    const headers = this.storeService.pribaviHeaders();
    const url = this.prijavaUrl + `prijaveNaTurniru/${turnirId}`;
    return this.http.get<Prijava[]>(url, { headers });
  }
  izbaciTimSaTurnira(prijavaId: number): Observable<any> {
    const url = this.prijavaUrl + `izbaciTimSaTurnira/${prijavaId}`;
    return this.http.delete(url);
  }
  odjaviSvojTimSaTurnira(
    turnirId: number,
    igracId: number
  ): Observable<Prijava[]> {
    const headers = this.storeService.pribaviHeaders();
    const url =
      this.prijavaUrl + `odjaviSvojTimSaTurnira/${turnirId}/${igracId}`;
    return this.http.delete<Prijava[]>(url, { headers });
  }
}
