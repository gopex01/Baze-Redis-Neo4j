import { Igrac } from './igrac';

export interface Turnir {
  id: number;
  naziv: string;
  datumOdrzavanja: string;
  mestoOdrzavanja: string;
  maxBrojTimova: number;
  trenutniBrojTimova: number;
  nagrada: number;
  prijavljeniIgraci: Igrac[];
}
