import { createReducer, on } from '@ngrx/store';
import { initialStatePrijava } from './prijava.state';
import * as PrijavaActions from './prijava.actions';
export const prijavaReducer = createReducer(
  initialStatePrijava,
  on(PrijavaActions.prijaviSeNaTurnir, (state, { turnir }) => {
    return { ...state, turnir };
  }),
  on(PrijavaActions.dodajPreferenceUPrijavu, (state, { preference }) => ({
    ...state,
    preference: { ...preference },
  })),
  on(PrijavaActions.OcistiStore, (state) => {
    return { ...initialStatePrijava };
  })
);
