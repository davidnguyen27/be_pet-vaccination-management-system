import { OwnerModel } from '@/modules/owner/application/model/owner.model';
import { OwnerResponseDTO } from '../dto/owner-response.dto';

export class OwnerHttpMapper {
  static toResponse(owner: OwnerModel): OwnerResponseDTO {
    return {
      id: owner.id,
      user: {
        id: owner.user.id,
        role: owner.user.role,
        email: owner.user.email,
        fullName: owner.user.fullName,
        phoneNumber: owner.user.phoneNumber,
        avatarUrl: owner.user.avatarUrl,
        dob: owner.user.dob?.toISOString() ?? null,
        isActive: owner.user.isActive,
        isDeleted: owner.user.isDeleted,
      },
      address: owner.address,
      locationLat: owner.locationLat,
      locationLng: owner.locationLng,
      totalPoints: owner.totalPoints,
      createdAt: owner.createdAt.toISOString(),
      updatedAt: owner.updatedAt.toISOString(),
    };
  }

  static toResponseList(items: OwnerModel[]): OwnerResponseDTO[] {
    return items.map(owner => this.toResponse(owner));
  }
}
