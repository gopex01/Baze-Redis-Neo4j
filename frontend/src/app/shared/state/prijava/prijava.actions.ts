import { createAction, props } from '@ngrx/store';
import { Preference } from '../../models/preference';
import { Turnir } from '../../models/turnir';

export const prijaviSeNaTurnir = createAction(
  '[Prijava] prijavi se na turnir',
  props<{ turnir: Turnir }>()
);

export const dodajPreferenceUPrijavu = createAction(
  '[prijava] dodaj preference u prijavu',
  props<{ preference: Preference }>()
);

export const OcistiStore = createAction('[Prijava]Ocisti stores');
