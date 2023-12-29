import { PrijavaState } from './prijava/prijava.state';
import { TurnirState } from './turnir/turnir.state';

export interface AppState {
  turnirState: TurnirState;
  prijavaState: PrijavaState;
}
