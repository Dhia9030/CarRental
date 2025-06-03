import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateComplaintInput } from "./dto/create-complaint.input";
import { UpdateComplaintInput } from "./dto/update-complaint.input";
import { Complaint } from "./entities/complaint.entity";
import { Booking } from "src/booking/entities/booking.entity";

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
    const complaints = await this.complaintRepository.find({
      relations: [
        "complainantUser",
        "complainantAgency",
        "againstUser",
        "againstAgency",
        "booking",
      ],
    });
    return complaints.map((complaint) => {
      if (complaint.booking?.startDate) {
        // Ensure startDate is a Date object before using toISOString
        const dateObj = new Date(complaint.booking.startDate);
        complaint.booking.startDate = new Date(
          dateObj.toISOString().split("T")[0] + "T00:00:00Z"
        );
      }
      return complaint;
    });
  }

  async findOne(id: number) {
    const complaint = await this.complaintRepository.findOne({
      where: { id },
      relations: [
        "complainantUser",
        "complainantAgency",
        "againstUser",
        "againstAgency",
        "booking",
      ],
    });
    if (complaint?.booking?.startDate) {
      const dateObj = new Date(complaint.booking.startDate);
      complaint.booking.startDate = new Date(
        dateObj.toISOString().split("T")[0] + "T00:00:00Z"
      );
    }

    return complaint;
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

  async updateComplaintStatus(
    id: number,
    status: "Ouverte" | "En cours" | "Résolue"
  ): Promise<Complaint> {
    const complaint = await this.findOne(id);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    complaint.status = status;
    complaint.updatedAt = new Date();
    return this.complaintRepository.save(complaint);
  }

  async updateComplaintPriority(
    id: number,
    priority: "Haute" | "Moyenne" | "Basse"
  ): Promise<Complaint> {
    const complaint = await this.findOne(id);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    complaint.priority = priority;
    complaint.updatedAt = new Date();
    return this.complaintRepository.save(complaint);
  }
}
