import { Resolver, Query, Args } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  users() {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  user(@Args("id") id: number) {
    return this.userService.findById(id);
  }
}
