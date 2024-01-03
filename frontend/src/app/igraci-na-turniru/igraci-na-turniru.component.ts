import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { StoreService } from '../services/store.service';
import { Igrac } from '../shared/models/igrac';
@Component({
  selector: 'app-igraci-na-turniru',
  templateUrl: './igraci-na-turniru.component.html',
  styleUrls: ['./igraci-na-turniru.component.css'],
})
export class IgraciNaTurniruComponent {
  turnirId: number = 0;
  prijavljeniIgraci$: Observable<Igrac[]> =
    this.storeService.vratiPrijavljeneIgrace(this.turnirId);
  constructor(
    private route: ActivatedRoute,

    private storeService: StoreService
  ) {}
  ngOnInit() {
    const turnirIdParam = this.route.snapshot.paramMap.get('turnirId');
    if (turnirIdParam !== null) {
      this.turnirId = +turnirIdParam;
      this.prijavljeniIgraci$ = this.storeService.vratiPrijavljeneIgrace(
        this.turnirId
      );
    }
  }
}
