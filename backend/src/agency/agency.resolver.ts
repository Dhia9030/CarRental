import { Resolver, Query, Args } from "@nestjs/graphql";
import { AgencyService } from "./agency.service";
import { Agency } from "./entities/agency.entity";

@Resolver(() => Agency)
export class AgencyResolver {
  constructor(private readonly agencyService: AgencyService) {}

  @Query(() => [Agency])
  agencies() {
    return this.agencyService.findAll();
  }

  @Query(() => Agency, { nullable: true })
  agency(@Args("id") id: number) {
    return this.agencyService.findById(id);
  }
}
