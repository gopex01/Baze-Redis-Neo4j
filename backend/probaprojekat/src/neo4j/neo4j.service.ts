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
      console.log('uloga je' + dekodiraniToken.role);
      if (dekodiraniToken.role == Role.Igrac) {
        const idIgraca = dekodiraniToken.sub;
        //MATCH (p)-[:PARTICIPATES_IN]->(r:Registration)-[:REGISTRATION_FOR]->(t)
        const query = `MATCH (p) WHERE ID(p) =toInteger($idIgraca)
      MATCH (p)-[:PARTICIPATES_IN]->(r:Registration)-[:REGISTRATION_FOR]->(t:TOURNAMENT)
      RETURN t
      `;
        await session.run(query, { idIgraca });
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
        console.log(turniri);
        return turniri;
      }
    } finally {
      await session.close();
    }
  }
  async deleteTournament(turnirId: string) {
    const session: Session = this.driver.session();
    try {
      const query = `
      MATCH (t) WHERE ID(t)=toInteger($turnirId) 
      MATCH (r:Registration)-[p:REGISTRATION_FOR]->(t)
      DETACH DELETE r`;
      await session.run(query, { turnirId });
    } finally {
      await session.close();
    }
  }
  async filterTournaments(
    pretragaNaziv: string | undefined,
    pretragaMesto: string | undefined,
    pretragaPocetniDatum: string | undefined,
    pretragaKrajnjiDatum: string | undefined,
    pretragaPocetnaNagrada: number | undefined,
    pretragaKrajnjaNagrada: number | undefined,
  ) {
    const session: Session = this.driver.session();
    try {
      let query = 'MATCH (t:TOURNAMENT) WHERE 1=1';

      const params: { [key: string]: any } = {};

      if (pretragaNaziv) {
        query += ' AND t.naziv CONTAINS $pretragaNaziv';
        params.pretragaNaziv = pretragaNaziv;
      }

      if (pretragaMesto) {
        query += ' AND t.mestoOdrzavanja CONTAINS $pretragaMesto';
        params.pretragaMesto = pretragaMesto;
      }

      // Ovo je primjer za filtriranje prema datumima, potrebno je prilagoditi zahtjevima vaše baze podataka
      if (pretragaPocetniDatum && pretragaKrajnjiDatum) {
        query +=
          ' AND t.datumOdrzavanja >= $pretragaPocetniDatum AND t.datumOdrzavanja <= $pretragaKrajnjiDatum';
        params.pretragaPocetniDatum = pretragaPocetniDatum;
        params.pretragaKrajnjiDatum = pretragaKrajnjiDatum;
      }

      if (pretragaPocetnaNagrada && pretragaKrajnjaNagrada) {
        query +=
          ' AND t.nagrada >= $pretragaPocetnaNagrada AND t.nagrada <= $pretragaKrajnjaNagrada';
        params.pretragaPocetnaNagrada = pretragaPocetnaNagrada;
        params.pretragaKrajnjaNagrada = pretragaKrajnjaNagrada;
      }
      query += ' RETURN t';
      const result = await session.run(query, params);
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
  async getTournament(name: string) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n:TOURNAMENT) WHERE n.naziv = $name RETURN n',
        { name },
      );
      if (result.records.length > 0) {
        const tournament = result.records[0].get('n').properties;
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
      console.log(result.records.map((record) => record.get('n').properties));
    } finally {
      await session.close();
    }
  }
  async getAllPlayers() {
    const session: Session = this.driver.session();
    try {
      const result = await session.run('MATCH (n:Player) RETURN n');
      return result.records.map((record) => record.get('n').properties);
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
      const players = result.records.map(
        (record) => record.get('n').properties,
      );
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
      SET n.korisnickoIme ='smrda',
          n.ime = 'smrdia',
          n.prezime = 'smrdic'
      RETURN n`;
      const result = await session.run(query, { IdPlayer, newPlayer });
      if (result.records.length > 0) {
        const updatedPlayer = result.records[0].get('n').properties;
        console.log(updatedPlayer);
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
      console.log(result.records[0]);
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
  //todo ne radi vrv zbog upit
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
    const turniri = result.records.map((record) => record.get('t').properties);
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
    const igraci = result.records.map((record) => record.get('p').properties);
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
    const players = result.records.map((record) => record.get('p').properties);
    return players;
  }
  async vratiMoguceSaigrace(igracId: string) {
    const session: Session = await this.driver.session();

    try {
      const query = `
      MATCH (p)
      WHERE NOT ID(p) = toInteger($igracId) AND NOT p.VodjaTima = true
      RETURN p
    `;
      return await session.run(query, { igracId });
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
      const message: MessageEntity = new MessageEntity(
        'prijavljeni ste na turnir',
        'delivered',
      );

      // newRegistration.PlayersIds.forEach(async (playerId) => {
      //   message.playerId = playerId;
      //   message.tournamentId = newRegistration.TournamentId;
      //   await this.messageService.createMessage(message);
      // });
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
    return result.records.map((record) => record.get('r').properties);
  }
  async removeTeamFromTournament(registrationId: string) {
    const session: Session = await this.driver.session();
    try {
      const query = `MATCH (r) WHERE ID(r)=toInteger($registrationId)
    DETACH DELETE r`;
      await session.run(query, { registrationId });
    } finally {
      await session.close();
    }
  }
  async vratiPrijavuPoId(registrationId: string) {
    const session: Session = await this.driver.session();
    try {
      const query = `MATCH (r) WHERE ID(r)=toInteger($registrationId)
     RETURN r`;
      await session.run(query, { registrationId });
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
      MATCH (o)-[r:CREATED]->(t)
      RETURN COUNT(r) as count
      `;
      await session.run(query, { organizatorId, turnirId });
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
