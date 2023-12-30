import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Organizator } from 'src/organizator/organizator.entity';
import { OrganizatorResolver } from 'src/organizator/organizator.resolver';
import { Player } from 'src/player/player.entity';
import { IgracResolver } from 'src/player/player.resolver';
@Injectable()
export class AuthService {
  constructor(
    private igracService: IgracResolver,
    private organizatorService: OrganizatorResolver,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    let role: string = 'igrac';
    let user: Player | Organizator | undefined =
      await this.igracService.getOnePlayer(username);
    if (!user) {
      user = await this.organizatorService.findOneOrganizator(username);
      role = 'organizator';
    }
    if (user) {
      const isMatchs = pass === user.lozinka;
      if (isMatchs) {
        const { lozinka, ...userBezLozinke } = user;
        return {
          ...userBezLozinke,
          role: role,
        };
      }
    }

    return null;
  }

  async login(korisnik: any) {
    const payload = {
      username: korisnik.korisnickoIme,
      sub: korisnik.id,
      role: korisnik.role,
    };
    const tok = this.jwtService.sign(payload);
    return {
      access_token: this.jwtService.sign(payload),
      korisnik: korisnik,
    };
  }
}
