import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TurnirService } from '../services/turnir/turnir.service';
import { Turnir } from '../shared/models/turnir';

import { Store } from '@ngrx/store';
import { StoreService } from '../services/store.service';
import { Igrac } from '../shared/models/igrac';
import { Organizator } from '../shared/models/organizator';
import { selectSviTurniri } from '../shared/state/turnir/turnir.selector';
import * as PrijavaActions from '../shared/state/prijava/prijava.actions';
import * as IgracActions from '../shared/state/igrac/igrac.actions';
import * as TurnirActions from '../shared/state/turnir/turnir.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  sviTurniri$: Observable<Turnir[]> = this.turnirService.getTurniriBaza();
  //filtriraniTurniri: Turnir[] = [];
  turniriStore$: Observable<Turnir[]> = this.store.select(selectSviTurniri);
  postojeFiltriraniTurniri: boolean = false;
  pretragaIzvrsena: boolean = false;
  trenutnoPrijavljeniKorisnik$: Observable<Igrac | Organizator | undefined> =
    this.storeService.pribaviTrenutnoPrijavljenogKorisnika();
  constructor(
    private turnirService: TurnirService,
    private storeService: StoreService,
    private store: Store
  ) {
    this.turniriStore$ = this.store.select(selectSviTurniri);
    this.store.dispatch(PrijavaActions.OcistiStore());
    this.store.dispatch(IgracActions.ocistiStore());
    this.turnirService.getLastFiveTournaments().subscribe((turniri) => {
      //  this.filtriraniTurniri = p;
      this.store.dispatch(TurnirActions.fetchTurniriUspesno({ turniri }));
      // console.log('Stipendija', this.filtriraniTurniri);
    });
  }

  handlePretragaRezultati(rezultati: Turnir[]) {
    // this.filtriraniTurniri = rezultati;
    // this.postojeFiltriraniTurniri =
    //   this.filtriraniTurniri && this.filtriraniTurniri.length > 0;
    // this.pretragaIzvrsena = true;
  }
}
