import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Organizator } from '../../models/organizator';
import { Igrac } from '../../models/igrac';

const selectPrijavljeniKorisnikFeature = createFeatureSelector<
  Organizator | Igrac | undefined
>('prijavljeniKorisnik');
const selectTokenFeature = createFeatureSelector<string>('token');
export const selectPrijavljeniKorisnik = createSelector(
  selectPrijavljeniKorisnikFeature,
  (state) => state
);
export const selectTokenPrijavljenogKorisnika = createSelector(
  selectTokenFeature,
  (state) => state
);
