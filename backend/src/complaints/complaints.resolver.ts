import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { ComplaintsService } from "./complaints.service";
import { Complaint } from "./entities/complaint.entity";
import { CreateComplaintInput } from "./dto/create-complaint.input";
import { UpdateComplaintInput } from "./dto/update-complaint.input";

@Resolver(() => Complaint)
export class ComplaintsResolver {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Mutation(() => Complaint)
  createComplaint(
    @Args("createComplaintInput") createComplaintInput: CreateComplaintInput
  ) {
    return this.complaintsService.create(createComplaintInput);
  }

  @Query(() => [Complaint], { name: "complaints" })
  findAllComplaints() {
    return this.complaintsService.findAll();
  }

  @Query(() => Complaint, { name: "complaint" })
  findOneComplaint(@Args("id", { type: () => Int }) id: number) {
    return this.complaintsService.findOne(id);
  }

  @Mutation(() => Complaint)
  updateComplaint(
    @Args("updateComplaintInput") updateComplaintInput: UpdateComplaintInput
  ) {
    return this.complaintsService.update(
      updateComplaintInput.id,
      updateComplaintInput
    );
  }
  @Mutation(() => Complaint)
  updateComplaintStatus(
    @Args("id", { type: () => Int }) id: number,
    @Args("status") status: "Ouverte" | "En cours" | "Résolue"
  ): Promise<Complaint> {
    return this.complaintsService.updateComplaintStatus(id, status);
  }

  @Mutation(() => Complaint)
  updateComplaintPriority(
    @Args("id", { type: () => Int }) id: number,
    @Args("priority") priority: "Haute" | "Moyenne" | "Basse"
  ): Promise<Complaint> {
    //console.log(priority);
    return this.complaintsService.updateComplaintPriority(id, priority);
  }

  removeComplaint(@Args("id", { type: () => Int }) id: number) {
    return this.complaintsService.remove(id);
  }
}
