import { EntityState } from '@ngrx/entity';
import { Igrac } from '../../models/igrac';
import { Preference } from '../../models/preference';
import { Prijava } from '../../models/prijava';
import { Turnir } from '../../models/turnir';

export interface PrijavaState {
  preference: Preference;
}
export const initialStatePrijava: PrijavaState = {
  preference: {
    potrebanBrojSlusalica: 0,
    potrebanBrojRacunara: 0,
    potrebanBrojTastatura: 0,
    potrebanBrojMiseva: 0,
  },
};
