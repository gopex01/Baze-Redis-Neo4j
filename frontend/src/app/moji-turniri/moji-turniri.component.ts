import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StoreService } from '../services/store.service';
import { TurnirService } from '../services/turnir/turnir.service';
import { Igrac } from '../shared/models/igrac';
import { Organizator } from '../shared/models/organizator';
import { Turnir } from '../shared/models/turnir';

@Component({
  selector: 'app-moji-turniri',
  templateUrl: './moji-turniri.component.html',
  styleUrls: ['./moji-turniri.component.css'],
})
export class MojiTurniriComponent {
  trenutnoPrijavljeniKorisnik$: Observable<Igrac | Organizator | undefined> =
    this.storeService.pribaviTrenutnoPrijavljenogKorisnika();

  mojiTurniri$: Observable<Turnir[]> = this.turnirService.getMojiTurniri();
  constructor(
    private turnirService: TurnirService,
    private storeService: StoreService,
    private router: Router,
    private store: Store
  ) {}
}
