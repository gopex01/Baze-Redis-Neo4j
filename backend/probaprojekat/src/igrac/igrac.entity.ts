import { ObjectType, Field, ID } from '@nestjs/graphql';
@ObjectType()
export class Igrac{
    @Field(()=>ID)
    id:string;

    @Field()
    ime:string;
}