export interface StaffModel {
  id: string;
  user: {
    id: string;
    role: string;
    email: string;
    fullName: string | null;
    phoneNumber: string | null;
    avatarUrl: string | null;
    dob: Date | null;
    isActive: boolean;
    isDeleted: boolean;
  };
  code: string;
  jobTitle: string | null;
  department: string | null;
  employmentType: string;
  employmentStatus: string;
  joinDate: Date;
  endDate: Date | null;
  address: string;
  citizenId: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
