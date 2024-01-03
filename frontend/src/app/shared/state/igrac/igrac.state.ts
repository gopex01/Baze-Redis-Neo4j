import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Igrac } from '../../models/igrac';

export interface IgracState extends EntityState<Igrac> {}
export const adapter = createEntityAdapter<Igrac>();
export const initialStateIgrac: IgracState = adapter.getInitialState();
