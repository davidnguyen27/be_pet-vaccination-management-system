import { VetResponseDTO } from '../dto/vet-response.dto';
import { VetModel } from '@/modules/vet/application/model/vet.model';

export class VetHttpMapper {
  static toResponse(vet: VetModel): VetResponseDTO {
    return {
      id: vet.id,
      user: {
        id: vet.user.id,
        role: vet.user.role,
        email: vet.user.email,
        fullName: vet.user.fullName,
        phoneNumber: vet.user.phoneNumber,
        avatarUrl: vet.user.avatarUrl,
        dob: vet.user.dob?.toISOString() ?? null,
        isActive: vet.user.isActive,
        isDeleted: vet.user.isDeleted,
      },
      bio: vet.bio,
      licenseNo: vet.licenseNo,
      licenseIssueBy: vet.licenseIssueBy,
      licenseValidFrom: vet.licenseValidFrom,
      licenseValidTo: vet.licenseValidTo,
      joinDate: vet.joinDate,
      endDate: vet.endDate,
      address: vet.address,
      citizenId: vet.citizenId,
      employmentStatus: vet.employmentStatus,
      createdAt: vet.createdAt,
      updatedAt: vet.updatedAt,
    };
  }

  static toResponseList(items: VetModel[]): VetResponseDTO[] {
    return items.map(item => this.toResponse(item));
  }
}
