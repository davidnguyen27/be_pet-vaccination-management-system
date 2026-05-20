import { StaffResponseDTO } from '../dto/staff-response.dto';
import { StaffModel } from '@/modules/staff/application/model/staff.model';

export class StaffHttpMapper {
  static toResponse(staff: StaffModel): StaffResponseDTO {
    return {
      id: staff.id,
      user: {
        id: staff.user.id,
        role: staff.user.role,
        email: staff.user.email,
        fullName: staff.user.fullName,
        phoneNumber: staff.user.phoneNumber,
        avatarUrl: staff.user.avatarUrl,
        dob: staff.user.dob?.toISOString() ?? null,
        isActive: staff.user.isActive,
        isDeleted: staff.user.isDeleted,
      },
      code: staff.code,
      jobTitle: staff.jobTitle,
      department: staff.department,
      employmentType: staff.employmentType,
      employmentStatus: staff.employmentStatus,
      joinDate: staff.joinDate,
      endDate: staff.endDate,
      address: staff.address,
      citizenId: staff.citizenId,
      notes: staff.notes,
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    };
  }

  static toResponseList(items: StaffModel[]): StaffResponseDTO[] {
    return items.map(staff => this.toResponse(staff));
  }
}
