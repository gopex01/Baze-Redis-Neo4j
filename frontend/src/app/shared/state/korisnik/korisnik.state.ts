import { Igrac } from '../../models/igrac';
import { Organizator } from '../../models/organizator';

export interface KorisnikState {
  prijavljeniKorisnik: Organizator | Igrac | undefined;
  token: string;
}
export const initialStateKorisnik: KorisnikState = {
  prijavljeniKorisnik: undefined,
  token: '',
};
