export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
}
export interface UpdateProfileData {
  fullName?: string;
}
