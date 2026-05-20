export interface VetModel {
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
  bio: string;
  licenseNo: string;
  licenseIssueBy: string;
  licenseValidFrom: Date;
  licenseValidTo: Date;
  joinDate: Date;
  endDate: Date | null;
  address: string;
  citizenId: string;
  employmentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
