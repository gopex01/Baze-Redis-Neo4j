import { ObjectType, Field, ID } from '@nestjs/graphql';
@ObjectType()
export class Registration {
  @Field(() => ID)
  id: string;
  @Field()
  nazivTima: string;
  @Field()
  potrebanBrojSlusalica: number;
  @Field()
  potrebanBrojRacunara: number;
  @Field()
  potrebanBrojTastatura: number;
  @Field()
  potrebanBrojMiseva: number;
  @Field(() => [ID])
  playersIds: string[];
  @Field(() => ID)
  tournamentId: string;
}
