import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IgracService } from '../services/igrac/igrac.service';
import { OrganizatorService } from '../services/organizator.service';
import { Igrac } from '../shared/models/igrac';
import { Organizator } from '../shared/models/organizator';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css'],
})
export class RegistracijaComponent {
  tipRegistracije: 'igrac' | 'organizator' = 'igrac';
  igrac: Igrac = {
    id: 0,
    korisnickoIme: '',
    lozinka: '',
    ime: '',
    prezime: '',
    vodjaTima: false,
    role: 'igrac',
  };
  organizator: Organizator = {
    id: 0,
    korisnickoIme: '',
    lozinka: '',
    ime: '',
    prezime: '',
    role: 'organizator',
  };
  constructor(
    private http: HttpClient,
    private igracService: IgracService,
    private organizatorService: OrganizatorService
  ) {}

  registrujSeKaoIgrac() {
    return this.igracService.registrujSeKaoIgrac(this.igrac);
  }
  registrujSeKaoOrganizator() {
    return this.organizatorService.registrujSeKaoOrganizator(this.organizator);
  }
}
