import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from 'src/roles/role.enum';

@ObjectType()
export class Organizator {
  @Field(() => ID)
  id: string;
  @Field()
  korisnickoIme: string;
  @Field()
  lozinka: string;
  @Field()
  ime: string;
  @Field()
  prezime: string;
}
