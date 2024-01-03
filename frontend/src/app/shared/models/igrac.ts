import { Prijava } from './prijava';
import { Turnir } from './turnir';

export interface Igrac {
  id: number;
  korisnickoIme: string;
  lozinka: string;
  ime: string;
  prezime: string;
  vodjaTima: boolean;
  role: string;
}
