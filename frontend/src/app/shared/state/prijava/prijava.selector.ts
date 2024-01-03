import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { Turnir } from '../../models/turnir';
import { Igrac } from '../../models/igrac';
import { PrijavaState } from './prijava.state';
import { Prijava } from '../../models/prijava';

const selectPrijavaFeature = (state: AppState) => state.prijavaState;

const selectTurnirUPrijaviFeature =
  createFeatureSelector<Turnir>('turnirUPrijavi');
const selectIgraciUPrijaviFeature =
  createFeatureSelector<Igrac[]>('igraciUPrijavi');
const selectPreferenceUPrijaviFeature =
  createFeatureSelector<Prijava>('preferenceUPrijavi');
export const selectIgraciUPrijavi = createSelector(
  selectIgraciUPrijaviFeature,
  (igraciUTimu) => igraciUTimu
);
export const selectPreferenceUPrijavi = createSelector(
  selectPreferenceUPrijaviFeature,
  (preference) => preference
);
