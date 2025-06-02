import { InputType, Field } from "@nestjs/graphql";
import { ComplaintCategory } from "../enums/category.enum";
@InputType()
export class CreateComplaintInput {
  @Field()
  title: string;

  @Field()
  complainantType: "Client" | "Agency";

  @Field()
  complainantName: string;

  @Field()
  against: string;

  @Field()
  category: ComplaintCategory;

  @Field()
  priority: "Haute" | "Moyenne" | "Basse";

  @Field()
  status: "Ouverte" | "En cours" | "Résolue";
}
