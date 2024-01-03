import { createReducer, on } from '@ngrx/store';
import { initialStateKorisnik } from './korisnik.state';
import * as KorisnikActions from './korisnik.actions';
export const korisnikReducer = createReducer(
  initialStateKorisnik,
  on(
    KorisnikActions.postaviPrijavljenogKorisnika,
    (state, { prijavljeniKorisnik }) => ({
      ...state,
      prijavljeniKorisnik: prijavljeniKorisnik,
    })
  ),
  on(KorisnikActions.odjaviPrijavljenogKorisnika, (state) => ({
    ...state,
    prijavljeniKorisnik: undefined,
  })),
  on(KorisnikActions.postaviTokenPrijavljenogKorisnika, (state, { token }) => ({
    ...state,
    token,
  }))
);
