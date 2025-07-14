export interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'portrait' | 'couple' | 'family' | 'engagement' | 'wedding';
  featured?: boolean;
  tags: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  includes: string[];
  category: 'portrait' | 'couple' | 'family' | 'engagement' | 'wedding';
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  serviceType: string;
  imageUrl?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  message: string;
}

export interface BookingForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  alternateDate: string;
  location: string;
  specialRequests: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  photoCount: number;
}

export interface ClientGallery {
  id: string;
  clientName: string;
  sessionDate: string;
  category: string;
  photos: Photo[];
  password?: string;
} 