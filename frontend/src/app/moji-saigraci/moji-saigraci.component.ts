import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IgracService } from '../services/igrac/igrac.service';
import { StoreService } from '../services/store.service';
import { Igrac } from '../shared/models/igrac';
import { Organizator } from '../shared/models/organizator';

@Component({
  selector: 'app-moji-saigraci',
  templateUrl: './moji-saigraci.component.html',
  styleUrls: ['./moji-saigraci.component.css'],
})
export class MojiSaigraciComponent implements OnInit {
  mojiSaigraci$: Observable<Igrac[]>;
  trenutnoPrijavljeniKorisnik$: Observable<Igrac | Organizator | undefined> =
    this.storeService.pribaviTrenutnoPrijavljenogKorisnika();
  constructor(
    private route: ActivatedRoute,
    private igracService: IgracService,
    private storeService: StoreService
  ) {
    this.mojiSaigraci$ = new Observable<Igrac[]>();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const turnirId = params['turnirId'];
      const igracId = params['igracId'];
      this.mojiSaigraci$ = this.igracService.vidiSaigrace(turnirId, igracId);
    });
  }
}
