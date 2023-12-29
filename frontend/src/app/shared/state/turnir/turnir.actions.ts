import { createAction, props } from '@ngrx/store';
import { Turnir } from '../../models/turnir';

export const fetchTurniri = createAction('[Turnir] Dohvati Sve Turnire');
export const fetchTurniriUspesno = createAction(
  '[Turnir] Dohvatanje Svih Turnira Uspesno',
  props<{ turniri: Turnir[] }>()
);
export const fetchTurniriNeuspesno = createAction(
  '[Turnir] Dohvatanje Svih Turnira Neuspesno',
  props<{ error: any }>()
);
export const setIzabraniTurnir = createAction(
  '[Turnir] Postavi Izabrani Turnir',
  props<{ turnirId: number }>()
);
