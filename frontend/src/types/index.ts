export interface User {
  id: number;
  email: string;
  role: 'brand' | 'influencer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  profile: BrandProfile | InfluencerProfile | null;
}

export interface BrandProfile {
  id: number;
  user_id: number;
  company_name: string;
  industry: string | null;
  website: string | null;
  logo: string | null;
  description: string | null;
  location: string | null;
}

export interface InfluencerProfile {
  id: number;
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  profile_photo: string | null;
  cover_photo: string | null;
  country: string | null;
  city: string | null;
  languages: string[] | null;
  followers: number;
  engagement_rate: number | null;
  pricing_min: number | null;
  pricing_max: number | null;
  pricing_currency: string;
  availability: 'available' | 'busy' | 'unavailable';
  experience_years: number | null;
  accepts_barter: boolean;
  barter_description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  categories: Category[];
  social_links: SocialLink[];
  gallery: GalleryItem[];
  collaborations: Collaboration[];
  email?: string;
  member_since?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  influencer_count?: number;
}

export interface SocialLink {
  id: number;
  influencer_id: number;
  platform: SocialPlatform;
  url: string;
  handle: string | null;
  followers: number;
}

export type SocialPlatform =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'linkedin'
  | 'twitter'
  | 'facebook'
  | 'website'
  | 'other';

export interface GalleryItem {
  id: number;
  influencer_id: number;
  image_url: string;
  title: string | null;
  description: string | null;
  sort_order: number;
}

export interface Collaboration {
  id: number;
  influencer_id: number;
  brand_name: string;
  description: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface Enquiry {
  id: number;
  brand_id: number | null;
  influencer_id: number;
  subject: string | null;
  message: string;
  budget_range: string | null;
  campaign_details: string | null;
  contact_name: string | null;
  contact_email: string | null;
  status: 'pending' | 'read' | 'replied' | 'closed';
  created_at: string;
  first_name?: string;
  last_name?: string;
  profile_photo?: string;
  country?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}
