import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FieldNotInSchema } from 'redis-om';
import { Player } from 'src/player/player.entity';

@ObjectType()
export class Tournament {
  @Field(() => ID)
  id: string;
  @Field()
  naziv: string;
  @Field()
  datumOdrzavanja: string;
  @Field()
  mestoOdrzavanja: string;
  @Field()
  maxBrojTimova: number;
  @Field()
  trenutniBrojTimova: number;
  @Field()
  nagrada: number;
  @Field(() => [ID])
  registrationsIds: string[];
}
