import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Driver, Session } from 'neo4j-driver';
import neo4j from 'neo4j-driver';
import { throwIfEmpty } from 'rxjs';
import { Player } from 'src/player/player.entity';
import { Tournament } from 'src/tournament/tournament.entity';

@Injectable()
export class Neo4jService {
  private readonly driver;

  constructor(private readonly configService: ConfigService) {
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
  async deleteTournament(turnirId: number) {
    //vezuje se za prijave
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
      console.log('Bez records');
      console.log(result);
      console.log('Sa records');
      console.log(result.records);
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
        console.log(result.records[0].get('n'));
        return player;
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
  async signInPlayerOnTournament(
    playerUsername: string,
    tournamentName: string,
  ) {
    const session: Session = this.driver.session();
    const player = await this.getOnePlayer(playerUsername);
    console.log(player);
    const tournament = await this.getTournament(tournamentName);
    console.log(tournament);
    //if (player && tournament) {
    //   return 'pronadjeni su';
    //tournament.Players = tournament.Players || [];
    //tournament.Players.push(player);
    //await this.updateTournament(tournament);
    //} else {
    //   throw new Error('Player or Tournament not found');
    // }
    const query = `
      MATCH (p:Player {username: $playerUsername})
      MATCH (t:TOURNAMENT) WHERE t.name = $tournamentName
      MERGE (p)-[:UCESTVUJE_NA]->(t)
    `;
    const result = await session.run(query, { playerUsername, tournamentName });
  }
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
  async playerTournaments(playerUsername: string) {
    const session: Session = this.driver.session();
    const query = `MATCH (p:Player {username: $playerUsername})-[:UCESTVUJE_NA]->(t:TOURNAMENT)
    RETURN t`;
    const result = await session.run(query, { playerUsername });
    const turniri = result.records.map((record) => record.get('t').properties);
    return turniri;
  }
}
