import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { OrganizatorModule } from 'src/organizator/organizator.module';
import { PlayerModule } from 'src/player/player.module';
import { IgracResolver } from 'src/player/player.resolver';
import { OrganizatorResolver } from 'src/organizator/organizator.resolver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { MessageService } from 'src/message/message.service';
import { RedisService } from 'src/redis-client/redis.service';
@Module({
  imports: [
    PlayerModule,
    OrganizatorModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    IgracResolver,
    OrganizatorResolver,
    Neo4jService,
    MessageService,
    RedisService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
