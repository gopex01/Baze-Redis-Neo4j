import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Preference } from '../shared/models/preference';
import { dodajPreferenceUPrijavu } from '../shared/state/prijava/prijava.actions';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css'],
})
export class PreferenceComponent {
  zeljenePreference: Preference = {
    potrebanBrojSlusalica: 0,
    potrebanBrojRacunara: 0,
    potrebanBrojTastatura: 0,
    potrebanBrojMiseva: 0,
  };
  constructor(private store: Store, private router: Router) {}
  potvrdiPreference() {
    this.store.dispatch(
      dodajPreferenceUPrijavu({
        preference: this.zeljenePreference,
      })
    );
    this.router.navigateByUrl('prijava');
  }
}
