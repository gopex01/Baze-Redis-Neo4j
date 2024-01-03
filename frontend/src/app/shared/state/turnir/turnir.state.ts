import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Turnir } from '../../models/turnir';

export interface TurnirState extends EntityState<Turnir> {
  izabraniTurnir: number;
}
export const adapter = createEntityAdapter<Turnir>();
export const initialStateTurnir: TurnirState = adapter.getInitialState({
  izabraniTurnir: 0,
});
