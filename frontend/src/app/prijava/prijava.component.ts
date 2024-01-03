import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { IgracService } from '../services/igrac/igrac.service';
import { PrijavaService } from '../services/prijava.service';
import { StoreService } from '../services/store.service';
import { Igrac } from '../shared/models/igrac';
import { Preference } from '../shared/models/preference';
import { Prijava } from '../shared/models/prijava';
import { Turnir } from '../shared/models/turnir';
import { selectPreferenceUPrijavi } from '../shared/state/prijava/prijava.selector';
import * as IgracActions from '../shared/state/igrac/igrac.actions';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css'],
})
export class PrijavaComponent {
  idTrenutnogKorisnika = this.storeService.pribaviIdPrijavljenogKorisnika();
  prijavljeniTurnir$: Observable<Turnir> =
    this.storeService.vratiPrijavljeniTurnir();

  igraciUTimu$: Observable<Igrac[]> = this.igracService.vratiIgraceIzTima();
  preference$: Observable<Preference> = this.store
    .select(selectPreferenceUPrijavi)
    .pipe(map((p: any) => p.preference));
  prijava: Prijava = {
    id: 0,
    nazivTima: '',
    potrebanBrojSlusalica: 0,
    potrebanBrojRacunara: 0,
    potrebanBrojTastatura: 0,
    potrebanBrojMiseva: 0,
    igraci: [],
    turnir: null,
  };
  constructor(
    private igracService: IgracService,
    private prijavaService: PrijavaService,
    private storeService: StoreService,
    private router: Router,
    private store: Store
  ) {}
  posaljiPrijavu() {
    this.prijavljeniTurnir$.subscribe((turnir) => {
      this.prijava.turnir = turnir;
    });

    this.igraciUTimu$.subscribe((igraci) => {
      this.prijava.igraci = igraci;
    });

    this.preference$.subscribe((preference) => {
      this.prijava.potrebanBrojSlusalica = preference.potrebanBrojSlusalica;
      this.prijava.potrebanBrojRacunara = preference.potrebanBrojRacunara;
      this.prijava.potrebanBrojTastatura = preference.potrebanBrojTastatura;
      this.prijava.potrebanBrojMiseva = preference.potrebanBrojMiseva;
    });
    this.prijavaService.posaljiPrijavuUBazu(this.prijava);
    this.prijavljeniTurnir$ = new Observable<Turnir>();
    this.igraciUTimu$ = new Observable<Igrac[]>();
    this.preference$ = new Observable<Preference>();
    this.prijava = {
      id: 0,
      nazivTima: '',
      potrebanBrojSlusalica: 0,
      potrebanBrojRacunara: 0,
      potrebanBrojTastatura: 0,
      potrebanBrojMiseva: 0,
      igraci: [],
      turnir: null,
    };

    this.router.navigateByUrl('');
  }
  izbaciIgracaIzTima(igrac: Igrac) {
    this.store.dispatch(IgracActions.izbaciIgracaIzTima({ igracId: igrac.id }));
  }
  navigirajNaIgrace() {
    this.router.navigateByUrl('sviIgraci');
  }
  navigirajNaPreference() {
    this.router.navigateByUrl('preference');
  }
}
