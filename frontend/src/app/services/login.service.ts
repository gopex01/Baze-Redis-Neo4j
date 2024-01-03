import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}
  posaljiZahtevZaLogin(korisnickoIme: string, lozinka: string) {
    const url = 'http://localhost:3000/auth/login';
    const obj = { username: korisnickoIme, password: lozinka };
    return this.http.post(url, obj); //vraca token i korisnika
  }
}
