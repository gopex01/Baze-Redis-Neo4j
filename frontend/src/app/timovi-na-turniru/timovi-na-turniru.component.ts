import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TurnirService } from '../services/turnir/turnir.service';
import { Observable, map } from 'rxjs';
import { Prijava } from '../shared/models/prijava';
import { PrijavaService } from '../services/prijava.service';
import { selectPrijavljeniKorisnik } from '../shared/state/korisnik/korisnik.selector';
import { Store } from '@ngrx/store';
import { Organizator } from '../shared/models/organizator';
import { Igrac } from '../shared/models/igrac';
import { OrganizatorService } from '../services/organizator.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-timovi-na-turniru',
  templateUrl: './timovi-na-turniru.component.html',
  styleUrls: ['./timovi-na-turniru.component.css'],
})
export class TimoviNaTurniruComponent {
  trenutnoPrijavljeniKorisnik$: Observable<Igrac | Organizator | undefined> =
    this.storeService.pribaviTrenutnoPrijavljenogKorisnika();
  prijave$: Observable<Prijava[]> = new Observable();
  turnirId: number = 0;
  organizatorId: number = 0;
  organizator: boolean = false;
  jeOrganizatorTurnira: Observable<any> = new Observable();
  constructor(
    private route: ActivatedRoute,
    private turnirService: TurnirService,
    private prijavaService: PrijavaService,
    private organizatorService: OrganizatorService,
    private storeService: StoreService,
    private store: Store
  ) {}

  ngOnInit() {
    const turnirIdParam = this.route.snapshot.paramMap.get('turnirId');
    if (turnirIdParam !== null) {
      this.turnirId = +turnirIdParam;
      const idKorisnika = this.storeService.pribaviIdPrijavljenogKorisnika();
      this.prijave$ = this.prijavaService.vratiPrijaveZaTurnir(this.turnirId);
      this.jeOrganizatorTurnira =
        this.organizatorService.daLiJeOrganizatorTurnira(
          idKorisnika,
          this.turnirId
        );
    }
  }

  izbaciTimSaTurnira(prijavaId: number) {
    this.prijavaService.izbaciTimSaTurnira(prijavaId).subscribe(() => {
      this.prijave$ = this.prijavaService.vratiPrijaveZaTurnir(this.turnirId);
    });
  }
}
