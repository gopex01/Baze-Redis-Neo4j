import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Tournament } from 'src/tournament/tournament.entity';
@ObjectType()
export class Player {
  @Field(() => ID)
  Id: string;
  @Field()
  Username: string;
  @Field()
  Password: string;
  @Field()
  NameAndSurname: string;
  @Field()
  TeamLeader: boolean;
  @Field(() => [Tournament], { nullable: true })
  Tournaments?: Tournament[];
}
