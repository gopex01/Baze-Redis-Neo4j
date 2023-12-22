import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Player {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  name: string;
  @Field()
  surname: string;

  @Field()
  teamLeader: boolean;

  @Field(() => [ID]) // Polje koje će čuvati ID-ove turnira
  tournamentsIds: string[]; // Niz ID-ova turnira koje igrač igra
}
