import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { StoreService } from './store.service';
import { Obavestenje } from '../shared/models/obavestenje';

@Injectable({
  providedIn: 'root',
})
export class ObavestenjaService {
  route: string;
  headers: HttpHeaders;
  constructor(private httpClient: HttpClient) {
    this.route = 'http://localhost:3000/Message';
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private storeService = inject(StoreService);

  vratiObavestenja() {
    const headers = this.storeService.pribaviHeaders();
    return this.httpClient.get<Obavestenje[]>(
      this.route + `/getMessagesForPlayer`,
      { headers: headers }
    );
  }
}
