import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Obavestenje } from '../shared/models/obavestenje';
import { StoreService } from '../services/store.service';
import { ObavestenjaService } from '../services/obavestenja.service';

@Component({
  selector: 'app-lista-obavestenja',
  templateUrl: './lista-obavestenja.component.html',
  styleUrls: ['./lista-obavestenja.component.css']
})
export class ListaObavestenjaComponent implements OnInit{

  private obavestenjaService = inject(ObavestenjaService);
  listaObavestenja$:Observable<Obavestenje[]|null>;
  username:string;
  ngOnInit(): void {
    
  }
  constructor()
  {
    this.listaObavestenja$= this.obavestenjaService.vratiObavestenja();
    this.username="";
  }

}
