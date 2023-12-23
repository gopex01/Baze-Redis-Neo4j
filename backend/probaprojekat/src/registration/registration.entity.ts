import { ObjectType, Field, ID } from '@nestjs/graphql';
@ObjectType()
export class Registration {
  @Field(() => ID)
  id: string;
  @Field()
  teamName: string;
  @Field()
  numberOfHeadphones: number;
  @Field()
  numberOfPCs: number;
  @Field()
  numberOfKeyboards: number;
  @Field()
  numberOfMouses: number;
  @Field(() => [ID])
  PlayersIds: string[];
  @Field(() => ID)
  TournamentId: string;
}
