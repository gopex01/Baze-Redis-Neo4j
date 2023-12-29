import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Igrac } from '../shared/models/igrac';
import { Organizator } from '../shared/models/organizator';
import { Observable } from 'rxjs';
import { StoreService } from './store.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OrganizatorService {
  constructor(
    private store: Store,
    private http: HttpClient,
    private storeService: StoreService,
    private router: Router
  ) {}
  organizatorUrl: string = 'http://localhost:3000/organizator/';
  registrujSeKaoOrganizator(organizator: Organizator) {
    const url = this.organizatorUrl + 'registrujOrganizatora';

    return this.http.post(url, organizator).subscribe(() => {
      this.router.navigateByUrl('');
    });
  }
  daLiJeOrganizatorTurnira(
    korisnikId: number | undefined | null,
    turnirId: number | undefined | null
  ): Observable<boolean> {
    const url =
      this.organizatorUrl +
      `daLiJeOrganizatorTurnira/${korisnikId}/${turnirId}`;
    const headers: HttpHeaders = this.storeService.pribaviHeaders();
    return this.http.get<boolean>(url, { headers });
  }
  izmeniPodatkeOOrganizatoru(
    organizator: Organizator
  ): Observable<Organizator> {
    const headers = this.storeService.pribaviHeaders();
    const url = this.organizatorUrl + 'izmeniPodatkeOOrganizatoru';
    return this.http.put<Organizator>(url, organizator, { headers });
  }
}
