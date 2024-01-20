import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Driver, Session, session } from 'neo4j-driver';
import neo4j from 'neo4j-driver';
import { throwIfEmpty } from 'rxjs';
import { jwtConstants } from 'src/auth/constants';
import { MessageEntity } from 'src/message/message.entity';
import { MessageService } from 'src/message/message.service';
import { Organizator } from 'src/organizator/organizator.entity';
import { Player } from 'src/player/player.entity';
import { Registration } from 'src/registration/registration.entity';
import { Tournament } from 'src/tournament/tournament.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles/role.enum';
@Injectable()
export class Neo4jService {
  private readonly driver;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
    private jwtService: JwtService,
  ) {
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('', ''),
    );
  }

  //!---------------------TOURNAMENT-----------------------------
  async allTournaments() {
    const session: Session = this.driver.session();
    try {
      const result = await session.run('MATCH (t:TOURNAMENT) RETURN t ');
      let turniri = [];
      result.records.map((record) => {
        const turnir = record.get('t').properties;
        turnir.id = record.get('t').identity.toString();
        turniri.push(turnir);
      });
      console.log(turniri);
      return turniri;
    } finally {
      await session.close();
    }
  }
  async addTournament(
    name: string,
    date: string,
    place: string,
    numberOfTeamsMax: number,
    numberOfTeamsNow: number,
    price: number,
    token: string,
  ) {
    const session: Session = this.driver.session();
    try {
      const noviToken = token.split(' ')[1];
      const dekodiraniToken = (await this.jwtService.verify(noviToken, {
        secret: jwtConstants.secret,
      })) as any;
      const idOrganizatora = dekodiraniToken.sub;

      const query = `
        MATCH (o) WHERE ID(o) = toInteger($idOrganizatora)
        CREATE (n:TOURNAMENT {
          naziv: $name,
          datumOdrzavanja: $date,
          mestoOdrzavanja: $place,
          maxBrojTimova: $numberOfTeamsMax,
          trenutniBrojTimova: $numberOfTeamsNow,
          nagrada: $price
        })<-[:CREATED_BY]-(o)
        RETURN n
      `;

      await session.run(query, {
        idOrganizatora,
        name,
        date,
        place,
        numberOfTeamsMax,
        numberOfTeamsNow,
        price,
      });
    } finally {
      await session.close();
    }
  }
  async vratiMojeTurnire(token: string) {
    const session: Session = this.driver.session();
    try {
      const noviToken = token.split(' ')[1];
      const dekodiraniToken = (await this.jwtService.verify(noviToken, {
        secret: jwtConstants.secret,
      })) as any;

      if (dekodiraniToken.role == Role.Igrac) {
        const idIgraca = dekodiraniToken.sub;
        //MATCH (p)-[:PARTICIPATES_IN]->(r:Registration)-[:REGISTRATION_FOR]->(t)
        const query = `MATCH (p) WHERE ID(p) =toInteger($idIgraca)
      MATCH (p)-[:PARTICIPATES_IN]->(r:Registration)-[:REGISTRATION_FOR]->(t:TOURNAMENT)
      RETURN t
      `;
        console.log('query je', query);
        console.log('id igraca je ', +idIgraca);
        const result = await session.run(query, { idIgraca });
        let turniri = [];
        result.records.map((record) => {
          const turnir = record.get('t').properties;
          turnir.id = record.get('t').identity.toString();
          turniri.push(turnir);
        });

        return turniri;
      }
      if (dekodiraniToken.role == Role.Organizator) {
        const idOrganizatora = dekodiraniToken.sub;
        const query = `MATCH (o) WHERE ID(o)=toInteger($idOrganizatora) MATCH (o)-[:CREATED_BY]->(t:TOURNAMENT) RETURN t`;
        const result = await session.run(query, { idOrganizatora });
        // const id = result.records[0].get('t').identity.toString();
        // const podaci = result.records.map(
        //   (record) => record.get('t').properties,
        // );
        let turniri = [];
        result.records.map((record) => {
          const turnir = record.get('t').properties;
          turnir.id = record.get('t').identity.toString();
          turniri.push(turnir);
        });

        return turniri;
      }
    } finally {
      await session.close();
    }
  }
  async deleteTournament(turnirId: string) {
    console.log('brisem turnir sa id' + turnirId);
    const session: Session = this.driver.session();
    try {
      const query = `
      MATCH (t) WHERE ID(t)=toInteger($turnirId) 
      DETACH DELETE t`;
      await session.run(query, { turnirId });
    } finally {
      await session.close();
    }
  }
  async filterTournaments(
    pretragaNaziv: string,
    pretragaMesto: string,
    pretragaPocetniDatum: string,
    pretragaKrajnjiDatum: string,
    pretragaPocetnaNagrada: number,
    pretragaKrajnjaNagrada: number,
  ) {
    const session: Session = this.driver.session();
    try {
      console.log('filtiranje');
      let query = 'MATCH (t:TOURNAMENT) WHERE 1=1';

      const params: { [key: string]: any } = {};

      if (pretragaNaziv) {
        console.log('pretragaNaziv');
        query += ' AND t.naziv = $pretragaNaziv';
        params.pretragaNaziv = pretragaNaziv;
      }

      if (pretragaMesto) {
        console.log('pretragaMesto');
        query += ' AND t.mestoOdrzavanja CONTAINS $pretragaMesto';
        params.pretragaMesto = pretragaMesto;
      }

      // Ovo je primjer za filtriranje prema datumima, potrebno je prilagoditi zahtjevima vaše baze podataka
      if (pretragaPocetniDatum && pretragaKrajnjiDatum) {
        console.log('pretragaPocetniDatum');
        query +=
          ' AND t.datumOdrzavanja >= $pretragaPocetniDatum AND t.datumOdrzavanja <= $pretragaKrajnjiDatum';
        params.pretragaPocetniDatum = pretragaPocetniDatum;
        params.pretragaKrajnjiDatum = pretragaKrajnjiDatum;
      }

      if (pretragaPocetnaNagrada) {
        console.log('pocnetna nagrada je ' + pretragaPocetnaNagrada);
        query += ' AND t.nagrada > $pretragaPocetnaNagrada ';
        params.pretragaPocetnaNagrada = pretragaPocetnaNagrada;
      }
      if (pretragaKrajnjaNagrada) {
        query += ' AND t.nagrada < $pretragaKrajnjaNagrada ';
        params.pretragaKrajnjaNagrada = pretragaKrajnjaNagrada;
      }

      query += ' RETURN t';
      console.log(query);
      console.log(params);
      const result = await session.run(query, params);
      let turniri = [];
      result.records.map((record) => {
        const turnir = record.get('t').properties;
        turnir.id = record.get('t').identity.toString();
        turniri.push(turnir);
      });

      return turniri;
    } finally {
      await session.close();
    }
  }
  async getTournament(name: string) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n:TOURNAMENT) WHERE n.naziv = $name RETURN n',
        { name },
      );
      if (result.records.length > 0) {
        const tournament = result.records[0].get('n').properties;
        tournament.id = result.records[0].get('n').identity.toString();
        return tournament;
      } else {
        return null;
      }
    } finally {
      await session.close();
    }
  }

  async getTournamentById(tournamentId: string) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (t) WHERE ID(t) = toInteger($tournamentId) RETURN t',
        { tournamentId },
      );
      const record = result.records[0];
      if (record) {
        const node = record.get('t').properties;
        node.id = record.get('t').identity.toString();
        return node;
      } else {
        return {
          message: 'ne postoji',
        };
      }
    } finally {
      await session.close();
    }
  }

  //!----------------------PLAYER--------------------------
  async savePlayer(
    Username: string,
    Password: string,
    Name: string,
    Surname: string,
    TeamLeader: boolean,
  ): Promise<void> {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'CREATE (n:Player {korisnickoIme:$Username, lozinka:$Password, ime:$Name, prezime:$Surname,vodjaTima:$TeamLeader}) RETURN n',
        { Username, Password, Name, Surname, TeamLeader },
      );
      //console.log(result.records.map((record) => record.get('n').properties));
    } finally {
      await session.close();
    }
  }
  async getAllPlayers() {
    const session: Session = this.driver.session();
    try {
      const result = await session.run('MATCH (n:Player) RETURN n');
      let igraci = [];
      result.records.map((record) => {
        const igrac = record.get('p').properties;
        igrac.id = record.get('p').identity.toString();
        igraci.push(igrac);
      });

      return igraci;
    } finally {
      await session.close();
    }
  }
  async getOnePlayer(username: string): Promise<Player> {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (n:Player {korisnickoIme: $username}) RETURN n `,
        { username },
      );

      if (result.records.length > 0) {
        const player = result.records[0].get('n').properties;
        const id = result.records[0].get('n').identity.toString();
        player.id = id;
        player.registrationIds = [];
        // const playerWithNeo4jId = {
        //   ...player,
        //   id,
        // };

        return player as Player;
      } else {
        return null;
      }
    } finally {
      await session.close();
    }
  }
  // async findOne(username: string) {
  //   const session: Session = this.driver.session();
  //   try {
  //     const result = await session.run(
  //       'MATCH (n:Player {korisnickoIme: $username}) RETURN n ',
  //       { username },
  //     );
  //     if (result.records.length > 0) {
  //       const player = result.records[0].get('n').properties;
  //       const id = result.records[0].get('n').identity.toString();
  //       const playerWithNeo4jId = {
  //         ...player,
  //         id,
  //       };
  //       return playerWithNeo4jId;
  //     } else {
  //       return null;
  //     }
  //   } finally {
  //     await session.close();
  //   }
  // }
  async getPlayersWithSimilarUsername(username: string) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n:Player) WHERE n.korisnickoIme CONTAINS $username RETURN n',
        { username },
      );
      let players = [];
      result.records.map((record) => {
        const igrac = record.get('n').properties;
        igrac.id = record.get('n').identity.toString();
        players.push(igrac);
      });
      return players;
    } finally {
      await session.close();
    }
  }
  async changePlayerData(IdPlayer: string, newPlayer: Player) {
    const session: Session = this.driver.session();
    try {
      const query = `
      MATCH (n) WHERE ID(n) = toInteger($IdPlayer)
      SET n.korisnickoIme = $newPlayer.korisnickoIme,
          n.ime = $newPlayer.ime,
          n.prezime = $newPlayer.prezime
      RETURN n`;
      const result = await session.run(query, { IdPlayer, newPlayer });
      if (result.records.length > 0) {
        const updatedPlayer = result.records[0].get('n').properties;
        return updatedPlayer;
      } else {
        return null;
      }
    } finally {
      await session.close();
    }
  }
  async isPlayerRegisteredForTournament(
    tournamentId: string,
    playerId: string,
  ) {
    const session = await this.driver.session();
    try {
      const query = `
      MATCH (p) WHERE ID(p)=toInteger($playerId)
      MATCH (t) WHERE ID(t)=toInteger($tournamentId)
      MATCH (p)-[:PARTICIPATES_IN]->(r:Registration)-[:REGISTRATION_FOR]->(t)
      RETURN COUNT(r) as count
      `;
      const result = await session.run(query, { tournamentId, playerId });
      const count = result.records[0].get('count').toInt();

      return count > 0;
    } finally {
      await session.close();
    }
  }
  async getPlayerById(idPlayer: string) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n) WHERE ID(n) = toInteger($idPlayer) RETURN n',
        { idPlayer },
      );
      const record = result.records[0];
      if (record) {
        const node = record.get('n');
        return node;
      } else {
        return {
          message: 'ne postoji',
        };
      }
    } finally {
      await session.close();
    }
  }

  async updateTournament(tournament: Tournament) {
    const session: Session = this.driver.session();

    try {
      const query = `
        MATCH (t:TOURNAMENT {naziv: $name})
        SET t = $tournament
        RETURN t
      `;

      await session.run(query, {
        naziv: tournament.naziv,
        tournament,
      });
    } finally {
      await session.close();
    }
  }
  async close(): Promise<void> {
    await this.driver.close();
  }

  async getPlayerTournaments(playerUsername: string) {
    const session: Session = this.driver.session();
    const query = `MATCH (p:Player {korisnickoIme: $playerUsername})-[:PARTICIPATES_IN]->(r:Registration)-
    [REGISTRATION_FOR]->(t:TOURNAMENT)
    RETURN t`;
    const result = await session.run(query, { playerUsername });
    let turniri = [];
    result.records.map((record) => {
      const turnir = record.get('t').properties;
      turnir.id = record.get('t').identity.toString();
      turniri.push(turnir);
    });

    return turniri;
  }
  async getAllPlayersOnTournament(tournamentName: string) {
    const session = this.driver.session();
    //const query = `MATCH (p:Player)-[:UCESTVUJE_NA]->(MATCH ((t) WHERE ID(t) = toInteger($tournamentName)) RETURN p`;
    const query = `
    MATCH (p:Player)-[:UCESTVUJE_NA]->(t:TOURNAMENT {naziv:$tournamentName})
    RETURN p
  `;
    const result = await session.run(query, { tournamentName });
    let igraci = [];
    result.records.map((record) => {
      const igrac = record.get('p').properties;
      igrac.id = record.get('p').identity.toString();
      igraci.push(igraci);
    });

    return igraci;
  }
  async getTeammates(turnirId: string, playerId: string) {
    const session = await this.driver.session();
    const query = `
      MATCH (t:TOURNAMENT) WHERE ID(t)=toInteger($turnirId)
      MATCH (p:Player)-[:PARTICIPATES_IN]->(r:Registration)-[:REGISTRATION_FOR]->(t)
      WHERE NOT ID(p) = toInteger($playerId)
      RETURN p`;
    const result = await session.run(query, { turnirId, playerId });
    let igraci = [];
    result.records.map((record) => {
      const igrac = record.get('p').properties;
      igrac.id = record.get('p').identity.toString();
      igraci.push(igrac);
    });
    return igraci;
  }
  async vratiMoguceSaigrace(igracId: string) {
    const session: Session = await this.driver.session();

    try {
      const query = `
      MATCH (p:Player) WHERE NOT ID(p) = toInteger($igracId) RETURN p
    `;

      const result = await session.run(query, { igracId });
      let igraci = [];
      result.records.map((record) => {
        const igrac = record.get('p').properties;
        igrac.id = record.get('p').identity.toString();
        igraci.push(igrac);
      });
      return igraci;
    } finally {
      await session.close();
    }
  }
  //!---------------REGISTRATION---------------
  async getRegistration(registrationId: string) {
    const session = await this.driver.session();
    const query = `MATCH (r: Registration) WHERE ID(r)=toInteger($registrationId) RETURN r`;
    const result = await session.run(query, { registrationId });
    return result.records.map((record) => record.get('r').properties);
  }
  async createRegistration(newRegistration: Registration) {
    const session: Session = await this.driver.session();
    try {
      const query = `MATCH (t) WHERE ID(t)=toInteger($newRegistration.tournamentId)
     CREATE (r:Registration{
        nazivTima: $newRegistration.nazivTima,
        potrebanBrojSlusalica: $newRegistration.potrebanBrojSlusalica,
        potrebanBrojRacunara: $newRegistration.potrebanBrojRacunara,
        potrebanBrojTastatura: $newRegistration.potrebanBrojTastatura,
        potrebanBrojMiseva: $newRegistration.potrebanBrojMiseva
      })
      MERGE (t)<-[:REGISTRATION_FOR]-(r)
      WITH r
      UNWIND $newRegistration.playersIds as playerId
      MATCH (p) WHERE ID(p)=toInteger(playerId)
      MERGE (p)-[:PARTICIPATES_IN]->(r)
      RETURN r
      `;
      await session.run(query, { newRegistration });
      const query1 = `
      MATCH(t:TOURNAMENT) WHERE ID(t) =toInteger($newRegistration.tournamentId) 
      SET t.trenutniBrojTimova = t.trenutniBrojTimova+1
      RETURN t
      `;
      await session.run(query1, { newRegistration });
      const message: MessageEntity = new MessageEntity(
        'prijavljeni ste na turnir',
        'delivered',
      );

      newRegistration.playersIds.forEach(async (playerId) => {
        message.playerId = playerId;
        message.tournamentId = newRegistration.tournamentId;
        await this.messageService.createMessage(message);
      });
      return {
        porukaGreske: undefined,
      };
    } finally {
      await session.close();
    }
  }
  async allRegistrationsForTournament(tournamentId: string) {
    const session: Session = await this.driver.session();
    const query = `MATCH (t) WHERE ID(t)=toInteger($tournamentId)
    MATCH (r:Registration)-[:REGISTRATION_FOR]->(t)
    RETURN r
    `;
    const result = await session.run(query, { tournamentId });
    const registrations = [];
    result.records.map((record) => {
      const prijava = record.get('r').properties;
      prijava.id = record.get('r').identity.toString();
      registrations.push(prijava);
    });
    return registrations;
  }
  async removeTeamFromTournament(registrationId: string) {
    const session: Session = await this.driver.session();
    console.log('BRISEM PRJIAVU sa id' + registrationId);
    try {
      const query = `MATCH (r) WHERE ID(r)=toInteger($registrationId) DETACH DELETE r`;
      return await session.run(query, { registrationId });
    } finally {
      await session.close();
    }
  }
  async vratiPrijavuPoId(registrationId: string) {
    const session: Session = await this.driver.session();
    try {
      const query = `MATCH (r) WHERE ID(r)=toInteger($registrationId)
     RETURN r`;
      const result = await session.run(query, { registrationId });
      return result.records.map((record) =>
        record.get('r').properties.toString(),
      );
    } finally {
      await session.close();
    }
  }
  async odjaviSvojTimSaTurnira(turnirId: string, igracId: string) {
    const session: Session = await this.driver.session();
    try {
      // MATCH (p:Player)-[:PARTICIPATES_IN]->(r:Registration)-[:REGISTRATION_FOR]->(t)
      const query = `
      MATCH (t) WHERE ID(t)=toInteger($turnirId)
      MATCH (p) WHERE ID(p)=toInteger($igracId)
      MATCH (p)-[:PARTICIPATES_IN]->(r:Registration)-[:REGISTRATION_FOR]->(t)
      DETACH DELETE r
      `;
      await session.run(query, { turnirId, igracId });
    } finally {
      await session.close();
    }
  }
  //!-----------ORGANIZATOR----------------
  async findOneOrganizator(username: string) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n:Organizator {korisnickoIme: $username}) RETURN n ',
        { username },
      );
      if (result.records.length > 0) {
        const player = result.records[0].get('n').properties;
        const id = result.records[0].get('n').identity.toString();
        const organizatorWithNeo4jId = {
          ...player,
          id,
        };
        return organizatorWithNeo4jId;
      } else {
        return null;
      }
    } finally {
      await session.close();
    }
  }
  async registrujOrganizatora(organizator: Organizator) {
    const session: Session = await this.driver.session();
    try {
      const query = `CREATE (o:Organizator{korisnickoIme:$organizator.korisnickoIme,lozinka:$organizator.lozinka,ime:$organizator.ime,prezime:$organizator.prezime })`;
      await session.run(query, { organizator });
    } finally {
      await session.close();
    }
  }
  async daLiJeOrganizatorTurnira(organizatorId: string, turnirId: string) {
    const session: Session = this.driver.session();
    try {
      const query = `
      MATCH(o) WHERE ID(o)=toInteger($organizatorId)
      MATCH(t) WHERE ID(t)=toInteger($turnirId)
      MATCH (o)-[r:CREATED_BY]->(t)
      RETURN COUNT(r) as count
      `;
      const result = await session.run(query, { organizatorId, turnirId });
      const count = result.records[0].get('count').toInt();
      return count > 0;
    } finally {
      await session.close();
    }
  }
  async changeOrganizatorData(
    IdOrganizator: string,
    newOrganizator: Organizator,
  ) {
    const session: Session = this.driver.session();
    try {
      console.log('Id organizatora je' + IdOrganizator);
      const result = await session.run(
        `
        MATCH (n) WHERE ID(n) = toInteger($IdOrganizator)
        SET n.korisnickoIme = $newOrganizator.korisnickoIme,
            n.ime = $newOrganizator.ime,
            n.prezime = $newOrganizator.prezime
        RETURN n`,
        { IdOrganizator, newOrganizator },
      );
      if (result.records.length > 0) {
        const updatedPlayer = result.records[0].get('n').properties;
        return updatedPlayer;
      } else {
        return null;
      }
    } finally {
      await session.close();
    }
  }
}
