import {
  MemoizedSelector,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { TurnirState } from './turnir.state';
import { AppState } from '../app.state';
import { Turnir } from '../../models/turnir';

const selectTurnirFeature = createFeatureSelector<TurnirState>('turniri');

export const selectSviTurniri = createSelector(
  selectTurnirFeature,
  (turniri) =>
    turniri.ids
      .map((id) => turniri.entities[id])

      .filter((turnir) => turnir !== null && turnir !== undefined) as Turnir[]
);

export const selectIzabraniTurnirId = createSelector(
  selectTurnirFeature,
  (state) => state.izabraniTurnir
);
export const selectIzabraniTurnir = createSelector(
  selectTurnirFeature,
  selectIzabraniTurnirId,
  (turniri, turnirId) => turniri.entities[turnirId]
);
