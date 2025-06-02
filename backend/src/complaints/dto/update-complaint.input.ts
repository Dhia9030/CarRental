import { InputType, Field, Int, PartialType } from "@nestjs/graphql";
import { CreateComplaintInput } from "./create-complaint.input";

@InputType()
export class UpdateComplaintInput extends PartialType(CreateComplaintInput) {
  @Field(() => Int)
  id: number;
}
