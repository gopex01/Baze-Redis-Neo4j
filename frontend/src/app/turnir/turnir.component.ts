import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TurnirService } from '../services/turnir/turnir.service';
import { Turnir } from '../shared/models/turnir';

import { Observable } from 'rxjs';
import * as TurnirActions from 'src/app/shared/state/turnir/turnir.actions';
import { IgracService } from '../services/igrac/igrac.service';
import { OrganizatorService } from '../services/organizator.service';
import { PrijavaService } from '../services/prijava.service';
import { StoreService } from '../services/store.service';
import { Igrac } from '../shared/models/igrac';
import { Organizator } from '../shared/models/organizator';
import * as IgracActions from '../shared/state/igrac/igrac.actions';
@Component({
  selector: 'app-turnir',
  templateUrl: './turnir.component.html',
  styleUrls: ['./turnir.component.css'],
})
export class TurnirComponent {
  @Input()
  turnir!: Turnir;
  @Input()
  prikaziDugmice: boolean = true;
  trenutnoPrijavljeniKorisnik$: Observable<Igrac | Organizator | undefined> =
    this.storeService.pribaviTrenutnoPrijavljenogKorisnika();
  jePrijavljenNaTurnir: Observable<any> = new Observable();
  jeOrganizatorTurnira: Observable<any> = new Observable();
  constructor(
    private turnirService: TurnirService,
    private igracService: IgracService,
    private prijavaService: PrijavaService,
    private organizatorService: OrganizatorService,
    private storeService: StoreService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    const idTrenutnogKorisnika =
      this.storeService.pribaviIdPrijavljenogKorisnika();
    this.jePrijavljenNaTurnir = this.igracService.daLiJeIgracPrijavljenNaTurnir(
      this.turnir.id,
      idTrenutnogKorisnika
    );
    this.jeOrganizatorTurnira =
      this.organizatorService.daLiJeOrganizatorTurnira(
        idTrenutnogKorisnika,
        this.turnir.id
      );
  }
  prijaviSeNaTurnir(turnir: Turnir, korisnik: Igrac | Organizator) {
    const igrac: Igrac = korisnik as Igrac;
    this.store.dispatch(
      TurnirActions.setIzabraniTurnir({ turnirId: turnir.id })
    );
    //dodavanje trenutnog korisnika u tim
    this.store.dispatch(IgracActions.dodajIgracaUTim({ igrac }));
    this.router.navigateByUrl('sviIgraci');
  }
  odjaviSvojTimSaTurnira(turnirId: number, igracId: number) {
    this.prijavaService
      .odjaviSvojTimSaTurnira(turnirId, igracId)
      .subscribe(() => alert('uspesno ste odjavili turnir'));
  }
  async prikaziPrijavljeneTimove(turnirId: number) {
    this.router.navigateByUrl(`prijavljeniTimovi/${turnirId}`);
  }

  async vidiSaigrace(turnirId: number, igracId: number) {
    this.router.navigateByUrl(`mojiSaigraci/${turnirId}/${igracId}`);
  }

  async obrisiTurnir() {
    (await this.turnirService.obrisiTurnir(this.turnir.id)).subscribe((p) => {
      p;
    });
  }

  igracJeVodja(user: any): user is Igrac {
    return user.role === 'igrac' && user.vodjaTima === true;
  }
}
