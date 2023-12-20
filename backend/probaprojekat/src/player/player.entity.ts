import { ObjectType, Field, ID } from '@nestjs/graphql';
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
}
