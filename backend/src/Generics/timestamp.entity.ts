import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType({ isAbstract: true })
export class TimestampEntity {
  @Field(() => Date)
  @CreateDateColumn({
    update: false,
  })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
