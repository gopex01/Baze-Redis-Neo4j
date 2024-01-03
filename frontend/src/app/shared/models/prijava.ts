import { Igrac } from './igrac';
import { Turnir } from './turnir';

export interface Prijava {
  id: number;
  nazivTima: string;
  potrebanBrojSlusalica: number;
  potrebanBrojRacunara: number;
  potrebanBrojTastatura: number;
  potrebanBrojMiseva: number;
  igraci: Igrac[];
  turnir: Turnir | null;
}
