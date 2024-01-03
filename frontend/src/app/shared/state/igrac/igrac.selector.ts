import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IgracState } from './igrac.state';
import { Igrac } from '../../models/igrac';

const selectIgracFeature = createFeatureSelector<IgracState>('igraci');
export const selectSviIgraci = createSelector(
  selectIgracFeature,
  (igraci) =>
    igraci.ids
      .map((id) => igraci.entities[id])
      .filter((igrac) => igrac !== null && igrac !== undefined) as Igrac[]
);
