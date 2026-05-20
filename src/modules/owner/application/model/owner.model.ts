export interface OwnerModel {
  id: string;
  userId: string;
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
  address: string | null;
  locationLat: number | null;
  locationLng: number | null;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}
