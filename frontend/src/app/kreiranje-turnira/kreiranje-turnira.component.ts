import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TurnirService } from '../services/turnir/turnir.service';
import { Turnir } from '../shared/models/turnir';

@Component({
  selector: 'app-kreiranje-turnira',
  templateUrl: './kreiranje-turnira.component.html',
  styleUrls: ['./kreiranje-turnira.component.css'],
})
export class KreiranjeTurniraComponent {
  turnir: Turnir = {
    id: 0,
    naziv: '',
    datumOdrzavanja: '',
    mestoOdrzavanja: '',
    maxBrojTimova: 0,
    trenutniBrojTimova: 0,
    nagrada: 0,
    prijavljeniIgraci: [],
  };
  constructor(
    private turnirService: TurnirService,
    private _snackBar: MatSnackBar
  ) {}

  kreirajTurnir() {
    if (this.brojJeStepenDvojke(this.turnir.maxBrojTimova)) {
      this.turnirService.kreirajTurnir(this.turnir).subscribe((p) => {
        this._snackBar.open('Turnir je uspešno kreiran', 'Zatvori', {
          duration: 3000,
        });
      });
    } else {
      this._snackBar.open('Neodgovarajuci broj timova na turniru', 'Zatvori', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
    this.turnir = {
      id: 0,
      naziv: '',
      datumOdrzavanja: '',
      mestoOdrzavanja: '',
      maxBrojTimova: 0,
      trenutniBrojTimova: 0,
      nagrada: 0,
      prijavljeniIgraci: [],
    };
  }
  brojJeStepenDvojke(x: number) {
    return x > 0 && (x & (x - 1)) === 0;
  }
}
