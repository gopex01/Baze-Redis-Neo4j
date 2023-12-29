import { createReducer, on } from '@ngrx/store';
import { adapter, initialStateIgrac } from './igrac.state';
import * as IgracActions from './igrac.actions';

export const igracReducer = createReducer(
  initialStateIgrac,
  on(IgracActions.dodajIgracaUTim, (state, { igrac }) => {
    return adapter.addOne(igrac, state);
  }),
  on(IgracActions.izbaciIgracaIzTima, (state, { igracId }) => {
    return adapter.removeOne(igracId, state);
  }),
  on(IgracActions.ocistiStore, (state) => {
    return { ...initialStateIgrac };
  })
);
