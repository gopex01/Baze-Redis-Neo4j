import { Component, Input } from '@angular/core';
import { IgracService } from '../services/igrac/igrac.service';
import { Observable, map } from 'rxjs';
import { Igrac } from '../shared/models/igrac';
import { Turnir } from '../shared/models/turnir';
import { TurnirService } from '../services/turnir/turnir.service';
import { Store } from '@ngrx/store';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StoreService } from '../services/store.service';
import { selectPreferenceUPrijavi } from '../shared/state/prijava/prijava.selector';
@Component({
  selector: 'app-svi-igraci',
  templateUrl: './svi-igraci.component.html',
  styleUrls: ['./svi-igraci.component.css'],
})
export class SviIgraciComponent {
  constructor(
    private igracService: IgracService,
    private turnirService: TurnirService,
    private storeService: StoreService,
    private store: Store,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  sviIgraci$: Observable<Igrac[]> = this.igracService.vratiSveIgrace();
  pretragaIgraci$: Observable<Igrac[]> = new Observable<Igrac[]>();
  uneseniIgrac: string = '';
  trenutniTurnir: Turnir | null = null;

  dodajIgracaUtim(igrac: Igrac) {
    this.storeService
      .vratiPrijavljeniTurnir()
      .subscribe((p) => (this.trenutniTurnir = p));
    this.igracService
      .daLiJeIgracPrijavljenNaTurnir(this.trenutniTurnir!.id, igrac.id)
      .subscribe((p) => {
        if (p == true) {
          this._snackBar.open(
            'igrac vec prijavljen na ovaj turnir',
            'Zatvori',
            {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );
        } else {
          this.igracService.dodajIgracaUTim(igrac);
          this._snackBar.open('Dodali ste igraca u tim', 'Zatvori', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      });
  }
  pretraziIgrace(uneseniIgrac: string) {
    this.pretragaIgraci$ =
      this.igracService.vratiIgracePoKorisnickomImenu(uneseniIgrac);
  }
  navigirajNaPreference() {
    this.router.navigateByUrl('preference');
  }
  navigirajNaPrijavu() {
    this.router.navigateByUrl('prijava');
  }
}
