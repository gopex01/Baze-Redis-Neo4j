import { createAction, props } from '@ngrx/store';
import { Igrac } from '../../models/igrac';

export const dodajIgracaUTim = createAction(
  '[Igrac] Dodaj Igraca',
  props<{ igrac: Igrac }>()
);
export const izbaciIgracaIzTima = createAction(
  '[Igrac] Izbaci Igraca',
  props<{ igracId: number }>()
);
export const ocistiStore = createAction('[Igrac] ocisti store');
