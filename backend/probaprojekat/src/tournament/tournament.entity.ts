import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FieldNotInSchema } from 'redis-om';
import { Player } from 'src/player/player.entity';

@ObjectType()
export class Tournament {
  @Field(() => ID)
  Id: string;
  @Field()
  Name: string;
  @Field()
  Date: string;
  @Field()
  Place: string;
  @Field()
  NumberOfTeamsMax: number;
  @Field()
  NumberOfTeamsNow: number;
  @Field()
  Price: number;
  @Field(() => [Player], { nullable: true })
  Players?: Player[];
}
