import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateComplaintInput } from "./dto/create-complaint.input";
import { UpdateComplaintInput } from "./dto/update-complaint.input";
import { Complaint } from "./entities/complaint.entity";

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>
  ) {}
  async create(createComplaintInput: CreateComplaintInput) {
    return await this.complaintRepository.save(createComplaintInput);
  }

  async findAll() {
    return await this.complaintRepository.find();
  }

  async findOne(id: number) {
    return await this.complaintRepository.findOneBy({ id });
  }
  async update(id: number, updateComplaintInput: UpdateComplaintInput) {
    await this.complaintRepository.update(id, {
      ...updateComplaintInput,
      updatedAt: new Date(),
    });
    return this.complaintRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.complaintRepository.update(id, { deletedAt: new Date() });
    return { deleted: true };
  }
}
