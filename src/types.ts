export interface GuestRSVP {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  attending: 'yes' | 'no';
  guestsCount: number;
  companionNames?: string;
  notes?: string;
  createdAt: string;
}

export interface WeddingWish {
  id: string;
  author: string;
  relationship: string;
  message: string;
  createdAt: string;
}

export interface CarouselPhoto {
  id: string;
  src: string;
  title: string;
  description: string;
}
