export type ListingCategory = 
  | 'Books & Notes'
  | 'Electronics & STEM'
  | 'Lab Gear & Coats'
  | 'Dorm Living'
  | 'Calculators & Kits'
  | 'Stationery'
  | 'Sports'
  | 'Hostel'
  | 'Apparel'
  | 'Other';

export type ListingType = 'Donation' | 'Exchange';

export type ItemCondition = 'Like New' | 'Good' | 'Fair / Readable';

export type DropOffNode = 
  | 'Library North Atrium'
  | 'Engineering Block C'
  | 'Student Union Hub'
  | 'East Dorm Quad Hub'
  | 'Chemistry Annex'
  | 'South Dormitory';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  department: string;
  classYear: string;
  studentId: string;
  isVerified: boolean;
  karmaScore: number;
  primaryNode: DropOffNode;
  authProvider: 'google' | 'password';
}

export interface ListingItem {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  type: ListingType;
  condition: ItemCondition;
  location: DropOffNode;
  imageUrl: string;
  userId?: string;
  userName: string;
  userDept: string;
  userInitials: string;
  userAvatarBg?: string;
  userEmail?: string;
  listedTime: string;
  courseTag?: string;
  exchangeWish?: string;
  bookmarked?: boolean;
  status: 'available' | 'reserved' | 'completed';
  reservedByUserId?: string;
  reservedByName?: string;
}

export interface HandoverRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemType: ListingType;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterDept: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  dropOffNode: DropOffNode;
  proposedTime: string;
  offerNote: string;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  securityCode: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'swap' | 'system' | 'reminder';
  requestId?: string;
  itemId?: string;
}

export interface ImpactStats {
  itemsReused: number;
  activeListings: number;
  wasteDivertedKg: number;
  studentsSharing: number;
  fundsSavedUsd: number;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export type ActiveScreen = 'home' | 'browse-items' | 'impact' | 'safety' | 'dashboard';
