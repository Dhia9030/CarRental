
import { Booking } from "src/booking/entities/booking.entity";
import { Review } from "src/review/entities/review.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "../enums/role.enum";
import { TimestampEntity } from "src/Generics/timestamp.entity";
import { Exclude } from "class-transformer";
import { Complaint } from "src/complaints/entities/complaint.entity";
import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { Conversation } from "src/chat/entities/conversation.entity";
import { Message } from "src/chat/entities/message.entity";
@ObjectType()
@Entity()
@Unique(["email"])
export class User extends TimestampEntity {


  @Field(() => ID)

  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "varchar", length: 100, nullable: false })
  email: string;

  @Column({
    type: "varchar",
    length: 255, // enough for most hash formats
    nullable: false,
    select: false, // do not select password by default
  })
  password: string;


  @Field()
  @Column({ type: "varchar", length: 100, nullable: false })
  firstName: string;

  @Field()
  @Column({ type: "varchar", length: 100, nullable: false })
  lastName: string;

  @Field()
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.user)
  reviews: Promise<Review[]>;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @Field(() => [Complaint], { nullable: true })
  @OneToMany(() => Complaint, (complaint) => complaint.complainantUser)
  complaints: Complaint[];

  @Field(() => [Complaint], { nullable: true })
  @OneToMany(() => Complaint, (complaint) => complaint.againstUser)
  complaintsAgainst: Complaint[];

  @OneToMany(() => Conversation, conversation => conversation.user)
  userConversations: Conversation[];

  @OneToMany(() => Conversation, conversation => conversation.admin)
  adminConversations: Conversation[];

  @OneToMany(() => Message, message => message.sender)
  messages: Message[];
}
