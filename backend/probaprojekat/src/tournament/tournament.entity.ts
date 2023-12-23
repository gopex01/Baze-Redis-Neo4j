import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FieldNotInSchema } from 'redis-om';
import { Player } from 'src/player/player.entity';

@ObjectType()
export class Tournament {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field()
  date: string;
  @Field()
  place: string;
  @Field()
  numberOfTeamsMax: number;
  @Field()
  numberOfTeamsNow: number;
  @Field()
  price: number;
  @Field(() => [ID])
  registrationsIds: string[];
}
