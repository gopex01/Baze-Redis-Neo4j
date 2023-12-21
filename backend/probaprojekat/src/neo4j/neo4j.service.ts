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
        'CREATE (n:TOURNAMENT {Name:$name,Date:$date,Place:$place,NumberOfTeamsMax:$numberOfTeamsMax,NumberOfTeamsNow:$numberOfTeamsNow,Price:$price}) RETURN n',
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
        query += ' AND t.Name CONTAINS $pretragaNaziv';
        params.pretragaNaziv = pretragaNaziv;
      }

      if (pretragaMesto) {
        query += ' AND t.Place CONTAINS $pretragaMesto';
        params.pretragaMesto = pretragaMesto;
      }

      // Ovo je primjer za filtriranje prema datumima, potrebno je prilagoditi zahtjevima vaše baze podataka
      if (pretragaPocetniDatum && pretragaKrajnjiDatum) {
        query +=
          ' AND t.Date >= $pretragaPocetniDatum AND t.Date <= $pretragaKrajnjiDatum';
        params.pretragaPocetniDatum = pretragaPocetniDatum;
        params.pretragaKrajnjiDatum = pretragaKrajnjiDatum;
      }

      if (pretragaPocetnaNagrada && pretragaKrajnjaNagrada) {
        query +=
          ' AND t.Price >= $pretragaPocetnaNagrada AND t.Price <= $pretragaKrajnjaNagrada';
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
  async getTournament(name:string)
  {
    const session:Session=this.driver.session();
    try{
      const result=await session.run(
        'MATCH (n:TOURNAMENT) WHERE n.Name = $name RETURN n',
        {name}
      );
      if(result.records.length>0)
      {
        const tournament=result.records[0].get('n').properties;
        return tournament;
      }
      else{
        return null;
      }
    }
    finally{
      await session.close();
    }
  }
  async getTournamentById(tournamentId:string)
  {
    const session:Session=this.driver.session();
    try{
      const result=await session.run(
        'MATCH (t) WHERE ID(t) = toInteger($tournamentId) RETURN t',
        {tournamentId}
      );
      const record=result.records[0];
      if(record)
      {
        const node=record.get('t').properties;
        return node;
      }
      else{
        return {
          message:'ne postoji'
        }
      }
    }
    finally{
      await session.close();
    }
  }

  //!----------------------PLAYER--------------------------
  async savePlayer(
    username: string,
    password: string,
    NameAndSurname: string,
    TeamLeader: boolean,
  ): Promise<void> {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'CREATE (n:Player {Username:$username, Password:$password, NameAndSurname:$NameAndSurname, TeamLeader:$TeamLeader}) RETURN n',
        { username, password, NameAndSurname, TeamLeader },
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
        'MATCH (n:Player {Username: $username}) RETURN n ',
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
        'MATCH (n:Player) WHERE n.Username CONTAINS $username RETURN n',
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
    idPlayer: string,
    username: string,
    password: string,
    NameAndSurname: string,
    TeamLeader: boolean,
  ) {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n:Player {Id: $idPlayer}) SET n.Username=$username, n.Password=$password, n.NameAndSurname=$NameAndSurname, n.TeamLeader=$TeamLeader RETURN n',
        { idPlayer, username, password, NameAndSurname, TeamLeader },
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
  async getPlayerById(idPlayer:string)
  {
    const session:Session=this.driver.session();
    try{
      const result=await session.run(
        'MATCH (n) WHERE ID(n) = toInteger($idPlayer) RETURN n',
        {idPlayer}
      );
      const record=result.records[0];
      if(record)
      {
        const node=record.get('n');
        return node;
      }
      else{
        return{
        message:'ne postoji'
        }
      }

    }
    finally{
      await session.close();
    }
  }
  async signInPlayerOnTournament(playerUsername: string, tournamentName: string) {
   
    const player=await this.getOnePlayer(playerUsername);
    console.log(player);
    const tournament=await this.getTournament(tournamentName);
    console.log(tournament);
    if(player && tournament)
    {
      tournament.Players=tournament.Players || [];
      tournament.Players.push(player);
      await this.updateTournament(tournament);
    }
    else{
      throw new Error('Player or Tournament not found');
    }
  }
  async updateTournament(tournament:Tournament)
  {
    const session: Session = this.driver.session();

    try {
      const query = `
        MATCH (t:TOURNAMENT {Name: $name})
        SET t = $tournament
        RETURN t
      `;

      await session.run(query, {
        name: tournament.Name,
        tournament,
      });
    } finally {
      await session.close();
    }
  }
  async close(): Promise<void> {
    await this.driver.close();
  }
 
}
