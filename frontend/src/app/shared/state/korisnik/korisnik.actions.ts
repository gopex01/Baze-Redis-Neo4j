import { createAction, props } from '@ngrx/store';
import { Organizator } from '../../models/organizator';
import { Igrac } from '../../models/igrac';

export const postaviPrijavljenogKorisnika = createAction(
  '[Korisnik] postavi prijavljenog korisnika',
  props<{ prijavljeniKorisnik: Organizator | Igrac }>()
);
export const odjaviPrijavljenogKorisnika = createAction(
  '[Korisnik] odjavi prijavljenog korisnika'
);
export const postaviTokenPrijavljenogKorisnika = createAction(
  '[korisnik] postaviToken',
  props<{ token: string }>()
);
