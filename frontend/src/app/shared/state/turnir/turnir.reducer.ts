import { createReducer, on } from '@ngrx/store';
import * as TurnirActions from './turnir.actions';
import { adapter, initialStateTurnir, TurnirState } from './turnir.state';

export const turnirReducer = createReducer(
  initialStateTurnir,
  on(TurnirActions.fetchTurniriUspesno, (state, { turniri }) =>
    adapter.setAll(turniri, state)
  ),
  on(TurnirActions.setIzabraniTurnir, (state, { turnirId }) => ({
    ...state,
    izabraniTurnir: turnirId,
  }))
);
