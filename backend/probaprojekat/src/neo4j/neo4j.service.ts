import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Driver, Session, session } from 'neo4j-driver';
import neo4j from 'neo4j-driver';
import { throwIfEmpty } from 'rxjs';
import { MessageEntity } from 'src/message/message.entity';
import { MessageService } from 'src/message/message.service';
import { Player } from 'src/player/player.entity';
import { Registration } from 'src/registration/registration.entity';
import { Tournament } from 'src/tournament/tournament.entity';

@Injectable()
export class Neo4jService {
  private readonly driver;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('', ''),
    );
  }

  //!---------------------TOURNAMENT-----------------------------
  async allTournaments() {
    console.log('vracam sve turnire');
    const session: Session = this.driver.session();
    try {
      const result = await session.run('MATCH (t:TOURNAMENT) RETURN t ');
      console.log(result.records);
      console.log('mapirano:');
      console.log(result.records.map((record) => record.get('t').properties));
      // return 'ok';
      return result.records.map((record) => record.get('t').properties);
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
  ) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'CREATE (n:TOURNAMENT {name:$name,date:$date,place:$place,numberOfTeamsMax:$numberOfTeamsMax,numberOfTeamsNow:$numberOfTeamsNow,price:$price}) RETURN n',
        { name, date, place, numberOfTeamsMax, numberOfTeamsNow, price },
      );
      console.log(result.records);
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
        query += ' AND t.name CONTAINS $pretragaNaziv';
        params.pretragaNaziv = pretragaNaziv;
      }

      if (pretragaMesto) {
        query += ' AND t.place CONTAINS $pretragaMesto';
        params.pretragaMesto = pretragaMesto;
      }

      // Ovo je primjer za filtriranje prema datumima, potrebno je prilagoditi zahtjevima vaše baze podataka
      if (pretragaPocetniDatum && pretragaKrajnjiDatum) {
        query +=
          ' AND t.date >= $pretragaPocetniDatum AND t.date <= $pretragaKrajnjiDatum';
        params.pretragaPocetniDatum = pretragaPocetniDatum;
        params.pretragaKrajnjiDatum = pretragaKrajnjiDatum;
      }

      if (pretragaPocetnaNagrada && pretragaKrajnjaNagrada) {
        query +=
          ' AND t.price >= $pretragaPocetnaNagrada AND t.price <= $pretragaKrajnjaNagrada';
        params.pretragaPocetnaNagrada = pretragaPocetnaNagrada;
        params.pretragaKrajnjaNagrada = pretragaKrajnjaNagrada;
      }
      query += ' RETURN t';
      const result = await session.run(query, params);
      return result.records.map((record) => record.get('t').properties);
    } finally {
      await session.close();
    }
  }
  async getTournament(name: string) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n:TOURNAMENT) WHERE n.name = $name RETURN n',
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
        'CREATE (n:Player {username:$Username, password:$Password, name:$Name, surname:$Surname,teamLeader:$TeamLeader}) RETURN n',
        { Username, Password, Name, Surname, TeamLeader },
      );
      console.log(result.records);
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
  async getOnePlayer(username: string) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n:Player {username: $username}) RETURN n ',
        { username },
      );
      if (result.records.length > 0) {
        const player = result.records[0].get('n').properties;
        const id = result.records[0].get('n').identity.toString();
        const playerWithNeo4jId = {
          ...player,
          id,
        };
        return playerWithNeo4jId;
      } else {
        return null;
      }
    } finally {
      await session.close();
    }
  }
  async getPlayersWithSimilarUsername(username: string) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n:Player) WHERE n.username CONTAINS $username RETURN n',
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
  async changeData(
    IdPlayer: string,
    Username: string,
    Password: string,
    Name: string,
    Surname: string,
    TeamLeader: boolean,
  ) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n:Player {id: $idPlayer}) SET n.username=$Username, n.password=$Password, n.name=$Name,n.surname=$Surname, n.teamLeader=$TeamLeader RETURN n',
        { IdPlayer, Username, Password, Name, Surname, TeamLeader },
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
  //! to je ustv create registratoin, vrv treba obrisati
  // async registerPlayerForTournament(
  //   playerUsername: string,
  //   tournamentId: string,
  // ) {
  //   const session: Session = this.driver.session();
  //   const player = await this.getOnePlayer(playerUsername);
  //   const tournament = await this.getTournamentById(tournamentId);
  //   if (!player || !tournament) {
  //     return null;
  //   }
  //   // const query = `
  //   //   MATCH (p:Player {username: $playerUsername})
  //   //   MATCH (t) WHERE ID(t) = toInteger($tournamentId)
  //   //   MERGE (p)-[:UCESTVUJE_NA]->(t)
  //   // `;
  //   //   const query = `
  //   //   MATCH (p:Player {username: $playerUsername})
  //   // MATCH (t:Tournament {id: $tournamentId})
  //   // OPTIONAL MATCH (p)-[:REGISTERED_FOR]->(r:Registration)-[:FOR_TOURNAMENT]->(t)
  //   // WITH p, t, r
  //   // MERGE (p)-[:REGISTERED_FOR]->(reg:Registration)
  //   // ON CREATE SET reg = coalesce(r, {})
  //   // WITH reg, t
  //   // MERGE (reg)-[:FOR_TOURNAMENT]->(t)
  //   // RETURN reg
  //   //   `;
  //   const query = `
  //   MATCH (p:Player {username: $playerUsername})
  //   MATCH (t) WHERE ID(t) = toInteger($tournamentId)
  //   OPTIONAL MATCH (p)-[:REGISTERED_FOR]->(existingReg:Registration)-[:FOR_TOURNAMENT]->(t)
  //   WITH p, t, existingReg
  //   MERGE (p)-[:REGISTERED_FOR]->(reg:Registration)
  //   ON CREATE SET reg = coalesce(existingReg, {})
  //   WITH reg, t, existingReg
  //   FOREACH (r IN CASE WHEN existingReg IS NULL THEN [1] ELSE [] END |
  //     MERGE (reg)-[:FOR_TOURNAMENT]->(t)
  //   )
  //   RETURN reg
  //   `;
  //   const result = await session.run(query, {
  //     playerUsername,
  //     tournamentId,
  //   });
  //   const message: MessageEntity = new MessageEntity(
  //     'prijavljeni ste na turnir',
  //     'delivered',
  //   );
  //   message.playerId = player.id;
  //   message.tournamentId = tournamentId;
  //   console.log('id playera je' + player.id);
  //   console.log(message);
  //   await this.messageService.createMessage(message);
  // }
  async updateTournament(tournament: Tournament) {
    const session: Session = this.driver.session();

    try {
      const query = `
        MATCH (t:TOURNAMENT {name: $name})
        SET t = $tournament
        RETURN t
      `;

      await session.run(query, {
        name: tournament.name,
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
    const query = `MATCH (p:Player {username: $playerUsername})-[:UCESTVUJE_NA]->(t:TOURNAMENT)
    RETURN t`;
    const result = await session.run(query, { playerUsername });
    const turniri = result.records.map((record) => record.get('t').properties);
    return turniri;
  }
  async getAllPlayersOnTournament(tournamentName: string) {
    const session = this.driver.session();
    //const query = `MATCH (p:Player)-[:UCESTVUJE_NA]->(MATCH ((t) WHERE ID(t) = toInteger($tournamentName)) RETURN p`;
    const query = `
    MATCH (p:Player)-[:UCESTVUJE_NA]->(t:TOURNAMENT {name:$tournamentName})
    RETURN p
  `;
    const result = await session.run(query, { tournamentName });
    const igraci = result.records.map((record) => record.get('p').properties);
    return igraci;
  }
  async getTeammates(playerId: string, tournamentName: string) {
    const session = await this.driver.session();
    const query = `MATCH (p:Player)-[:UCESTVUJE_NA]->(t:TOURNAMENT {name:$tournamentName})
    WHERE NOT ID(p)=toInteger($playerId)
    RETURN p
    `;
    const result = await session.run(query, { playerId, tournamentName });
    const igraci = result.records.map((record) => record.get('p').properties);
    return igraci;
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
        teamName: $newRegistration.teamName,
        numberOfHeadphones: $newRegistration.numberOfHeadphones,
        numberOfPCs: $newRegistration.numberOfPCs,
        numberOfKeyboards: $newRegistration.numberOfKeyboards,
        numberOfMouses: $newRegistration.numberOfMouses
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
}
