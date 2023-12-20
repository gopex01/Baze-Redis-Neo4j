import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Driver, Session } from 'neo4j-driver';
import neo4j from 'neo4j-driver';

@Injectable()
export class Neo4jService {
  private readonly driver;

  constructor(private readonly configService: ConfigService) {
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('', ''),
    );
  }
  async savePlayer(
    username: string,
    password: string,
    NameAndSurname: string,
    TeamLeader: boolean,
  ): Promise<void> {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(
        'CREATE (n:Player {username:$username, password:$password, NameAndSurname:$NameAndSurname, TeamLeader:$TeamLeader}) RETURN n',
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
  async close(): Promise<void> {
    await this.driver.close();
  }
}
