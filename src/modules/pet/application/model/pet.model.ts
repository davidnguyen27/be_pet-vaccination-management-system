export interface PetModel {
  id: string;
  owner: {
    id: string;
    user: {
      id: string;
      role: string;
      email: string;
      fullName: string | null;
      phoneNumber: string | null;
      avatarUrl: string | null;
      dob: Date | null;
    };
    address: string | null;
    locationLat: number | null;
    locationLng: number | null;
    totalPoints: number;
  };
  species: string;
  name: string;
  sex: string;
  dob: Date;
  weight: number;
  color: string;
  breed: string;
  note: string | null;
  isSterilized: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
