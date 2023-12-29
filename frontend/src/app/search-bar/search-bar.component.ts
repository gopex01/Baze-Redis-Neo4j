import { Component, EventEmitter, Output } from '@angular/core';
import { TurnirService } from '../services/turnir/turnir.service';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  @Output() pretragaRezultati: EventEmitter<any> = new EventEmitter();
  pretragaNaziv: string = '';
  pretragaMesto: string = '';
  pretragaPocetniDatum: string = '';
  pretragaKrajnjiDatum: string = '';
  pretragaPocetnaNagrada: number = 0;
  pretragaKrajnjaNagrada: number = 0;

  constructor(private turnirService: TurnirService) {}
  async filtrirajTurnire() {
    (
      await this.turnirService.filtrirajTurnire(
        this.pretragaNaziv,
        this.pretragaMesto,
        this.pretragaPocetniDatum,
        this.pretragaKrajnjiDatum,
        this.pretragaPocetnaNagrada,
        this.pretragaKrajnjaNagrada
      )
    ).subscribe((rezultati) => {
      this.pretragaRezultati.emit(rezultati);
    });
  }
}
